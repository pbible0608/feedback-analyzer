import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { Env } from './types';

type Params = {
  feedbackId: number;
};

export class FeedbackAnalysisWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const { feedbackId } = event.payload;

    const feedback = await step.do('fetch-feedback', async () => {
      const row = await this.env.DB.prepare(
        'SELECT id, content FROM feedback WHERE id = ?'
      )
        .bind(feedbackId)
        .first<{ id: number; content: string }>();
      if (!row) throw new Error(`Feedback ${feedbackId} not found`);
      return row;
    });

    const summary = await step.do('generate-summary', async () => {
      const res = await this.env.AI.run(
        // @ts-expect-error — model string validated at runtime
        '@cf/meta/llama-3.1-8b-instruct',
        {
          messages: [
            {
              role: 'system',
              content:
                'Summarize the following customer feedback in 1-2 concise sentences. Return only the summary text.',
            },
            { role: 'user', content: feedback.content },
          ],
        }
      );
      return (res as { response?: string }).response ?? 'Unable to generate summary';
    });

    const analysis = await step.do('analyze-sentiment-urgency', async () => {
      const res = await this.env.AI.run(
        // @ts-expect-error — model string validated at runtime
        '@cf/meta/llama-3.1-8b-instruct',
        {
          messages: [
            {
              role: 'system',
              content: `Analyze the following customer feedback and return a JSON object with exactly two fields:
- "sentiment": a float between -1.0 (very negative) and 1.0 (very positive), where 0.0 is neutral
- "urgency": an integer from 1 to 4 (1=low, 2=medium, 3=high, 4=critical)
Return ONLY the JSON object, no other text.`,
            },
            { role: 'user', content: feedback.content },
          ],
        }
      );
      try {
        const parsed = JSON.parse(
          (res as { response?: string }).response ?? '{}'
        );
        return {
          sentiment:
            typeof parsed.sentiment === 'number' &&
            parsed.sentiment >= -1 &&
            parsed.sentiment <= 1
              ? parsed.sentiment
              : 0,
          urgency:
            typeof parsed.urgency === 'number' &&
            parsed.urgency >= 1 &&
            parsed.urgency <= 4
              ? parsed.urgency
              : 2,
        };
      } catch {
        return { sentiment: 0, urgency: 2 };
      }
    });

    const tags = await step.do('generate-tags', async () => {
      const res = await this.env.AI.run(
        // @ts-expect-error — model string validated at runtime
        '@cf/meta/llama-3.1-8b-instruct',
        {
          messages: [
            {
              role: 'system',
              content:
                'Extract 2-5 relevant tags from the customer feedback. Tags should be short (1-2 words). Return ONLY a JSON array of strings. Example: ["billing","feature request","ui"]',
            },
            { role: 'user', content: feedback.content },
          ],
        }
      );
      try {
        const parsed = JSON.parse(
          (res as { response?: string }).response ?? '[]'
        );
        return Array.isArray(parsed) ? (parsed as string[]) : [];
      } catch {
        return [] as string[];
      }
    });

    await step.do('update-database', async () => {
      await this.env.DB.prepare(
        "UPDATE feedback SET summary = ?, sentiment = ?, urgency = ?, tags = ?, updated_at = datetime('now') WHERE id = ?"
      )
        .bind(summary, analysis.sentiment, analysis.urgency, JSON.stringify(tags), feedbackId)
        .run();
    });

    return { feedbackId, summary, ...analysis, tags };
  }
}
