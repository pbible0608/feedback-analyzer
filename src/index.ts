import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { renderDashboard } from './ui/dashboard';
import { getMockFeedback } from './mock-data';

export { FeedbackAnalysisWorkflow } from './workflow';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Dashboard
app.get('/', (c) => c.html(renderDashboard()));

// List feedback with optional filters
app.get('/api/feedback', async (c) => {
  const { datasource, sentiment, urgency, status, assignee, limit = '50', offset = '0' } = c.req.query();

  let query = 'SELECT * FROM feedback WHERE 1=1';
  const params: string[] = [];

  if (datasource) {
    query += ' AND datasource = ?';
    params.push(datasource);
  }
  if (sentiment === 'positive') {
    query += ' AND sentiment > 0.3';
  } else if (sentiment === 'negative') {
    query += ' AND sentiment < -0.3';
  } else if (sentiment === 'neutral') {
    query += ' AND sentiment BETWEEN -0.3 AND 0.3';
  }
  if (urgency) {
    const urgencyMap: Record<string, string> = { low: '1', medium: '2', high: '3', critical: '4' };
    if (urgencyMap[urgency]) {
      query += ' AND urgency = ?';
      params.push(urgencyMap[urgency]);
    }
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (assignee) {
    query += ' AND assignee = ?';
    params.push(assignee);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.DB.prepare(query)
    .bind(...params)
    .all();

  return c.json({ data: result.results, success: true });
});

// Get single feedback
app.get('/api/feedback/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('SELECT * FROM feedback WHERE id = ?')
    .bind(id)
    .first();

  if (!result) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: result, success: true });
});

// Create new feedback (triggers AI workflow)
app.post('/api/feedback', async (c) => {
  const body = await c.req.json<{
    datasource?: string;
    url?: string;
    content?: string;
  }>();

  if (!body.datasource || !body.content) {
    return c.json({ error: 'datasource and content are required' }, 400);
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO feedback (datasource, url, content, status, created_at, updated_at) VALUES (?, ?, ?, 'new', datetime('now'), datetime('now')) RETURNING id"
  )
    .bind(body.datasource, body.url ?? '', body.content)
    .first<{ id: number }>();

  if (result?.id) {
    try {
      await c.env.FEEDBACK_ANALYSIS_WORKFLOW.create({
        params: { feedbackId: result.id },
      });
    } catch (err) {
      console.error('Workflow trigger failed (AI analysis will be skipped):', err);
    }
  }

  return c.json({ data: result, success: true }, 201);
});

// Update feedback (status and/or assignee)
app.patch('/api/feedback/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ status?: string; assignee?: string | null }>();

  const sets: string[] = [];
  const values: (string | null)[] = [];

  if (body.status) {
    if (!['new', 'ongoing', 'resolved'].includes(body.status)) {
      return c.json({ error: 'status must be "new", "ongoing", or "resolved"' }, 400);
    }
    sets.push('status = ?');
    values.push(body.status);
  }

  if ('assignee' in body) {
    sets.push('assignee = ?');
    values.push(body.assignee ?? null);
  }

  if (!sets.length) {
    return c.json({ error: 'Provide status or assignee to update' }, 400);
  }

  sets.push("updated_at = datetime('now')");
  values.push(id);
  await c.env.DB.prepare(`UPDATE feedback SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();

  return c.json({ success: true });
});

// Summary statistics
app.get('/api/stats', async (c) => {
  const [total, bySource, bySentiment, byUrgency, byStatus] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM feedback').first<{ count: number }>(),
    c.env.DB.prepare('SELECT datasource, COUNT(*) as count FROM feedback GROUP BY datasource').all(),
    c.env.DB.prepare(
      "SELECT CASE WHEN sentiment > 0.3 THEN 'positive' WHEN sentiment < -0.3 THEN 'negative' ELSE 'neutral' END as sentiment, COUNT(*) as count FROM feedback WHERE sentiment IS NOT NULL GROUP BY 1"
    ).all(),
    c.env.DB.prepare(
      "SELECT CASE urgency WHEN 4 THEN 'critical' WHEN 3 THEN 'high' WHEN 2 THEN 'medium' WHEN 1 THEN 'low' END as urgency, COUNT(*) as count FROM feedback WHERE urgency IS NOT NULL GROUP BY urgency"
    ).all(),
    c.env.DB.prepare('SELECT status, COUNT(*) as count FROM feedback GROUP BY status').all(),
  ]);

  return c.json({
    data: {
      total: total?.count ?? 0,
      bySource: bySource.results,
      bySentiment: bySentiment.results,
      byUrgency: byUrgency.results,
      byStatus: byStatus.results,
    },
    success: true,
  });
});

// Seed mock data
app.post('/api/seed', async (c) => {
  // Clear existing data
  await c.env.DB.prepare('DELETE FROM feedback').run();

  const items = getMockFeedback();
  const stmt = c.env.DB.prepare(
    'INSERT INTO feedback (datasource, url, content, summary, sentiment, urgency, tags, status, assignee, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  await c.env.DB.batch(
    items.map((item) =>
      stmt.bind(
        item.datasource,
        item.url,
        item.content,
        item.summary,
        item.sentiment,
        item.urgency,
        item.tags,
        item.status,
        item.assignee,
        item.created_at,
        item.updated_at
      )
    )
  );

  return c.json({ success: true, message: `Seeded ${items.length} feedback items` });
});

export default app;
