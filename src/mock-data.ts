const DAY = 86400000;

export function getMockFeedback() {
  const now = Date.now();
  return [
    {
      datasource: 'support_ticket',
      url: 'https://support.example.com/tickets/12847',
      content:
        "I've been charged twice for my subscription this month. Order #12847. I need a refund for the duplicate charge immediately. This is unacceptable as I've been a loyal customer for 3 years.",
      summary:
        'Customer reports duplicate subscription charge and requests immediate refund. Long-time customer expressing frustration over billing error.',
      sentiment: -0.82,
      urgency: 3,
      tags: JSON.stringify(['billing', 'refund', 'subscription']),
      status: 'new',
      assignee: 'Alice Chen',
      created_at: new Date(now - 1 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'discord',
      url: 'https://discord.com/channels/example/1234567890',
      content:
        "Has anyone figured out how to integrate the API with Next.js? The docs seem outdated. I keep getting CORS errors when trying to fetch from the client side. Spent the whole afternoon on this.",
      summary:
        'User struggling with API integration in Next.js due to CORS issues and outdated documentation.',
      sentiment: -0.55,
      urgency: 2,
      tags: JSON.stringify(['api', 'documentation', 'integration', 'CORS']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 2 * DAY).toISOString(),
      updated_at: new Date(now - 2 * DAY).toISOString(),
    },
    {
      datasource: 'github',
      url: 'https://github.com/example/repo/issues/423',
      content:
        'The export function crashes when handling files larger than 50MB. Stack trace shows an out-of-memory error in the buffer allocation. This is blocking our production pipeline. Reproducible on v2.4.1.',
      summary:
        'Critical bug: export crashes on files >50MB with OOM error in buffer allocation, blocking production.',
      sentiment: -0.91,
      urgency: 4,
      tags: JSON.stringify(['bug', 'export', 'memory', 'production']),
      status: 'ongoing',
      assignee: 'Bob Martinez',
      created_at: new Date(now - 3 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'email',
      url: '',
      content:
        "Just wanted to say your product has completely transformed our workflow. The team collaboration features are exactly what we needed. Our productivity has increased by 40% since we started using it. Keep up the great work!",
      summary:
        'Customer praises product for transforming team workflow and boosting productivity by 40%.',
      sentiment: 0.92,
      urgency: 1,
      tags: JSON.stringify(['praise', 'collaboration', 'productivity']),
      status: 'resolved',
      assignee: null,
      created_at: new Date(now - 3 * DAY).toISOString(),
      updated_at: new Date(now - 2 * DAY).toISOString(),
    },
    {
      datasource: 'twitter',
      url: 'https://twitter.com/user/status/123456789',
      content:
        "Been using @FeedbackAnalyzer for a week now. The dashboard is sleek but the load times are killing me. Sometimes takes 10+ seconds to refresh. Please fix this, it's becoming unusable during peak hours.",
      summary:
        'User reports slow dashboard load times (10+ seconds) especially during peak hours despite liking the design.',
      sentiment: -0.64,
      urgency: 2,
      tags: JSON.stringify(['performance', 'dashboard', 'ux']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 4 * DAY).toISOString(),
      updated_at: new Date(now - 4 * DAY).toISOString(),
    },
    {
      datasource: 'forum',
      url: 'https://community.example.com/t/keyboard-shortcuts/892',
      content:
        "I think it would be great to add keyboard shortcuts for navigating between feedback items. Something like j/k for up/down and Enter to open details. Would significantly speed up the triage process for power users.",
      summary:
        'Feature request for keyboard shortcuts (j/k navigation, Enter to open) to speed up feedback triage.',
      sentiment: 0.15,
      urgency: 1,
      tags: JSON.stringify(['feature request', 'ux', 'keyboard shortcuts']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 5 * DAY).toISOString(),
      updated_at: new Date(now - 5 * DAY).toISOString(),
    },
    {
      datasource: 'support_ticket',
      url: 'https://support.example.com/tickets/12903',
      content:
        "My account has been locked for 48 hours and I can't access any of my data. I've tried resetting my password 3 times but the reset email never arrives. This is urgent - we have a client presentation tomorrow and all our feedback data is in the platform.",
      summary:
        'Customer locked out of account for 48 hours, password reset emails not arriving. Urgent due to upcoming client presentation.',
      sentiment: -0.88,
      urgency: 4,
      tags: JSON.stringify(['account access', 'authentication', 'blocking']),
      status: 'ongoing',
      assignee: 'Carol Kim',
      created_at: new Date(now - 1 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'discord',
      url: 'https://discord.com/channels/example/1234567891',
      content:
        "The new dark mode is absolutely gorgeous! Finally I can work late at night without burning my eyes. The contrast ratios are perfect and it even remembers my preference. Whoever designed this deserves recognition.",
      summary:
        'User loves the new dark mode feature, praising the contrast ratios and preference persistence.',
      sentiment: 0.87,
      urgency: 1,
      tags: JSON.stringify(['dark mode', 'ui', 'praise']),
      status: 'resolved',
      assignee: null,
      created_at: new Date(now - 6 * DAY).toISOString(),
      updated_at: new Date(now - 4 * DAY).toISOString(),
    },
    {
      datasource: 'github',
      url: 'https://github.com/example/repo/issues/445',
      content:
        "README installation instructions are missing the step for setting up environment variables. New users will get a cryptic 'CONFIG_MISSING' error on first run without knowing they need to copy .env.example to .env and fill in the values.",
      summary:
        'Documentation gap: README missing environment variable setup step, causing confusing CONFIG_MISSING errors for new users.',
      sentiment: -0.12,
      urgency: 1,
      tags: JSON.stringify(['documentation', 'onboarding', 'readme']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 7 * DAY).toISOString(),
      updated_at: new Date(now - 7 * DAY).toISOString(),
    },
    {
      datasource: 'email',
      url: '',
      content:
        "We're evaluating your platform for our enterprise needs (500+ seats). Can you provide information about SSO integration, audit logs, role-based access control, and data retention policies? We need these features confirmed before we can proceed with procurement.",
      summary:
        'Enterprise prospect (500+ seats) requesting confirmation of SSO, audit logs, RBAC, and data retention capabilities.',
      sentiment: 0.21,
      urgency: 2,
      tags: JSON.stringify(['enterprise', 'sso', 'compliance', 'sales']),
      status: 'ongoing',
      assignee: 'David Park',
      created_at: new Date(now - 2 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'twitter',
      url: 'https://twitter.com/user2/status/987654321',
      content:
        'Switched from CompetitorX to @FeedbackAnalyzer last month. Best decision ever. The AI-powered sentiment analysis actually works and saves us hours of manual categorization every week. Highly recommend to any product team!',
      summary:
        'Customer switched from competitor, praising AI sentiment analysis for saving hours of manual categorization weekly.',
      sentiment: 0.95,
      urgency: 1,
      tags: JSON.stringify(['praise', 'ai', 'competitor comparison']),
      status: 'resolved',
      assignee: null,
      created_at: new Date(now - 8 * DAY).toISOString(),
      updated_at: new Date(now - 5 * DAY).toISOString(),
    },
    {
      datasource: 'forum',
      url: 'https://community.example.com/t/search-broken/901',
      content:
        "After the latest update (v2.5.0), the search function returns no results for queries containing special characters like '&', '+', or '#'. This worked fine in v2.4.x. I've verified this with multiple browsers.",
      summary:
        'Regression in v2.5.0: search fails for queries with special characters (&, +, #) that worked in v2.4.x.',
      sentiment: -0.73,
      urgency: 3,
      tags: JSON.stringify(['bug', 'search', 'regression']),
      status: 'new',
      assignee: 'Alice Chen',
      created_at: new Date(now - 2 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'support_ticket',
      url: 'https://support.example.com/tickets/12956',
      content:
        "I need to cancel my subscription and get a prorated refund. The product doesn't support the Salesforce and HubSpot integrations that were promised during the sales demo. Without these, the product doesn't fit our workflow at all.",
      summary:
        'Customer requesting cancellation and refund due to missing Salesforce/HubSpot integrations promised during sales.',
      sentiment: -0.81,
      urgency: 3,
      tags: JSON.stringify(['cancellation', 'refund', 'integrations', 'sales']),
      status: 'new',
      assignee: 'Bob Martinez',
      created_at: new Date(now - 1 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'discord',
      url: 'https://discord.com/channels/example/1234567892',
      content:
        "Can someone explain how the webhook system works for real-time notifications? I've set up an endpoint but events only fire intermittently. Sometimes I get the callback within seconds, other times it takes 5+ minutes or doesn't arrive at all.",
      summary:
        'User experiencing inconsistent webhook delivery - sometimes instant, sometimes delayed 5+ minutes or missing entirely.',
      sentiment: -0.18,
      urgency: 2,
      tags: JSON.stringify(['webhooks', 'notifications', 'reliability']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 4 * DAY).toISOString(),
      updated_at: new Date(now - 4 * DAY).toISOString(),
    },
    {
      datasource: 'github',
      url: 'https://github.com/example/repo/issues/467',
      content:
        "SQL injection vulnerability in the search endpoint. The query parameter is not properly sanitized when using the advanced filter mode. Parameterized queries are not used for the dynamic filter construction. See attached proof of concept.",
      summary:
        'Security vulnerability: SQL injection in search endpoint due to unsanitized query parameters in advanced filter mode.',
      sentiment: -0.94,
      urgency: 4,
      tags: JSON.stringify(['security', 'vulnerability', 'sql injection']),
      status: 'ongoing',
      assignee: 'Carol Kim',
      created_at: new Date(now - 1 * DAY).toISOString(),
      updated_at: new Date(now - 1 * DAY).toISOString(),
    },
    {
      datasource: 'email',
      url: '',
      content:
        "Your support team took 5 days to respond to my ticket and the response was a generic template that didn't address my specific issue at all. I expected much better service at $99/month. If this doesn't improve, we'll have to look at alternatives.",
      summary:
        'Customer frustrated with 5-day support response time and generic template reply. Threatening churn over poor service quality.',
      sentiment: -0.68,
      urgency: 2,
      tags: JSON.stringify(['support quality', 'response time', 'churn risk']),
      status: 'new',
      assignee: 'Alice Chen',
      created_at: new Date(now - 3 * DAY).toISOString(),
      updated_at: new Date(now - 2 * DAY).toISOString(),
    },
    {
      datasource: 'twitter',
      url: 'https://twitter.com/user3/status/111222333',
      content:
        "The mobile app for @FeedbackAnalyzer is really well done. Smooth animations, intuitive swipe gestures, and the offline mode actually works reliably. Impressive engineering work, especially the real-time sync when back online.",
      summary:
        'User praises mobile app for smooth UX, reliable offline mode, and seamless real-time sync capabilities.',
      sentiment: 0.88,
      urgency: 1,
      tags: JSON.stringify(['mobile app', 'praise', 'offline', 'ux']),
      status: 'resolved',
      assignee: null,
      created_at: new Date(now - 10 * DAY).toISOString(),
      updated_at: new Date(now - 7 * DAY).toISOString(),
    },
    {
      datasource: 'forum',
      url: 'https://community.example.com/t/performance-degradation/915',
      content:
        'Performance has degraded significantly over the past month. Dashboard queries that used to complete in under 100ms are now taking 2-3 seconds. The issue seems worse during business hours (9am-5pm EST). Multiple users in our org are reporting the same thing.',
      summary:
        'Significant performance regression: dashboard queries went from <100ms to 2-3 seconds, worse during business hours. Multiple users affected.',
      sentiment: -0.76,
      urgency: 3,
      tags: JSON.stringify(['performance', 'database', 'regression']),
      status: 'ongoing',
      assignee: 'David Park',
      created_at: new Date(now - 5 * DAY).toISOString(),
      updated_at: new Date(now - 3 * DAY).toISOString(),
    },
    {
      datasource: 'support_ticket',
      url: 'https://support.example.com/tickets/13001',
      content:
        "How do I export all my feedback data in CSV format? I can only see JSON export in the settings. I need CSV for our quarterly management report that gets imported into Excel. Is this feature available on the Pro plan?",
      summary:
        'Customer requesting CSV export capability for management reporting; currently only JSON export is available.',
      sentiment: 0.05,
      urgency: 2,
      tags: JSON.stringify(['export', 'csv', 'feature request']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 6 * DAY).toISOString(),
      updated_at: new Date(now - 6 * DAY).toISOString(),
    },
    {
      datasource: 'discord',
      url: 'https://discord.com/channels/example/1234567893',
      content:
        "The onboarding flow is really confusing. I created my account yesterday and I still don't understand how to connect my first data source. The tutorial videos reference UI elements that don't exist anymore. Can we get updated guides?",
      summary:
        'New user confused by onboarding flow; tutorial videos reference outdated UI elements. Requesting updated documentation.',
      sentiment: -0.58,
      urgency: 2,
      tags: JSON.stringify(['onboarding', 'documentation', 'ux']),
      status: 'new',
      assignee: null,
      created_at: new Date(now - 2 * DAY).toISOString(),
      updated_at: new Date(now - 2 * DAY).toISOString(),
    },
  ];
}
