export function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FeedbackAnalyzer</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      line-height: 1.6;
    }
    header {
      background: #0f172a;
      color: #f8fafc;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    header h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.025em; }
    header h1 span { color: #3b82f6; }
    .header-actions { display: flex; gap: 0.5rem; }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-secondary { background: #334155; color: #f8fafc; }
    main { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: #fff;
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .stat-value { font-size: 1.75rem; font-weight: 800; line-height: 1.2; }
    .stat-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }
    .stat-positive .stat-value { color: #059669; }
    .stat-negative .stat-value { color: #dc2626; }
    .stat-neutral .stat-value { color: #6b7280; }
    .stat-critical .stat-value { color: #dc2626; }
    .stat-high .stat-value { color: #d97706; }
    .stat-new .stat-value { color: #7c3aed; }
    .stat-resolved .stat-value { color: #059669; }

    /* Filters */
    .filter-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .filter-bar label { font-size: 0.8125rem; font-weight: 600; color: #475569; }
    .filter-select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      background: #fff;
      color: #0f172a;
      cursor: pointer;
      min-width: 140px;
    }
    .filter-select:focus { outline: 2px solid #3b82f6; outline-offset: -1px; }

    /* Feedback Cards */
    .feedback-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .card {
      background: #fff;
      border-radius: 0.75rem;
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      transition: box-shadow 0.15s;
    }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .card-header .status-select { margin-left: auto; }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .source-discord { background: #5865f21a; color: #5865f2; }
    .source-github { background: #1f29371a; color: #1f2937; }
    .source-twitter { background: #1da1f21a; color: #1a8cd8; }
    .source-email { background: #ea43351a; color: #ea4335; }
    .source-support_ticket { background: #f97316; color: #fff; }
    .source-forum { background: #8b5cf61a; color: #8b5cf6; }
    .sentiment-positive { background: #dcfce7; color: #166534; }
    .sentiment-negative { background: #fee2e2; color: #991b1b; }
    .sentiment-neutral { background: #f1f5f9; color: #475569; }
    .urgency-critical { background: #dc2626; color: #fff; }
    .urgency-high { background: #fef3c7; color: #92400e; }
    .urgency-medium { background: #dbeafe; color: #1e40af; }
    .urgency-low { background: #f0fdf4; color: #166534; }
    .status-select {
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      background: #fff;
    }
    .status-select.st-new { border-color: #8b5cf6; color: #7c3aed; }
    .status-select.st-ongoing { border-color: #f59e0b; color: #d97706; }
    .status-select.st-resolved { border-color: #10b981; color: #059669; }
    .card-content {
      font-size: 0.9375rem;
      color: #1e293b;
      margin-bottom: 0.75rem;
      line-height: 1.65;
    }
    .card-summary {
      font-size: 0.8125rem;
      color: #475569;
      background: #f8fafc;
      border-left: 3px solid #3b82f6;
      padding: 0.625rem 0.875rem;
      margin-bottom: 0.75rem;
      border-radius: 0 0.375rem 0.375rem 0;
    }
    .card-summary.pending {
      border-left-color: #d1d5db;
      color: #9ca3af;
      font-style: italic;
    }
    .card-assignee {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.8125rem;
    }
    .assignee-label { color: #64748b; font-weight: 600; white-space: nowrap; }
    .assignee-input {
      border: 1px solid transparent;
      border-radius: 0.375rem;
      padding: 0.2rem 0.5rem;
      font-size: 0.8125rem;
      font-family: inherit;
      color: #0f172a;
      background: transparent;
      width: 160px;
    }
    .assignee-input:hover { border-color: #e2e8f0; }
    .assignee-input:focus { border-color: #3b82f6; outline: none; background: #fff; }
    .assignee-input::placeholder { color: #94a3b8; font-style: italic; }
    .filter-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      background: #fff;
      color: #0f172a;
      min-width: 140px;
    }
    .filter-input:focus { outline: 2px solid #3b82f6; outline-offset: -1px; }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .tag {
      padding: 0.15rem 0.5rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      font-size: 0.6875rem;
      color: #475569;
      font-weight: 500;
    }
    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .source-link { color: #3b82f6; text-decoration: none; font-weight: 500; }
    .source-link:hover { text-decoration: underline; }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
      font-size: 0.9375rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .modal-overlay.hidden { display: none; }
    .modal {
      background: #fff;
      border-radius: 0.75rem;
      padding: 1.5rem;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    .modal h2 { font-size: 1.125rem; margin-bottom: 1rem; }
    .form-group { margin-bottom: 0.875rem; }
    .form-group label { display: block; font-size: 0.8125rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-family: inherit;
    }
    .form-group textarea { min-height: 100px; resize: vertical; }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus { outline: 2px solid #3b82f6; outline-offset: -1px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .btn-ghost { background: transparent; color: #64748b; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 600; cursor: pointer; }

    @media (max-width: 640px) {
      header { padding: 1rem; flex-wrap: wrap; gap: 0.75rem; }
      main { padding: 1rem; }
      .stats-grid { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); }
      .filter-bar { flex-direction: column; align-items: stretch; }
      .filter-select { min-width: unset; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Feedback<span>Analyzer</span></h1>
    <div class="header-actions">
      <button class="btn btn-secondary" id="seed-btn" onclick="seedData()">Seed Demo Data</button>
      <button class="btn btn-primary" onclick="openModal()">+ Add Feedback</button>
    </div>
  </header>

  <main>
    <section class="stats-grid" id="stats">
      <div class="stat-card">
        <div class="stat-value" id="stat-total">-</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat-card stat-negative">
        <div class="stat-value" id="stat-negative">-</div>
        <div class="stat-label">Negative</div>
      </div>
      <div class="stat-card stat-neutral">
        <div class="stat-value" id="stat-neutral">-</div>
        <div class="stat-label">Neutral</div>
      </div>
      <div class="stat-card stat-positive">
        <div class="stat-value" id="stat-positive">-</div>
        <div class="stat-label">Positive</div>
      </div>
      <div class="stat-card stat-high">
        <div class="stat-value" id="stat-high">-</div>
        <div class="stat-label">High</div>
      </div>
      <div class="stat-card stat-critical">
        <div class="stat-value" id="stat-critical">-</div>
        <div class="stat-label">Critical</div>
      </div>
      <div class="stat-card stat-new">
        <div class="stat-value" id="stat-new">-</div>
        <div class="stat-label">New</div>
      </div>
      <div class="stat-card stat-resolved">
        <div class="stat-value" id="stat-resolved">-</div>
        <div class="stat-label">Resolved</div>
      </div>
    </section>

    <section class="filter-bar">
      <label>Filters:</label>
      <select class="filter-select" data-filter="datasource">
        <option value="">All Sources</option>
        <option value="support_ticket">Support Tickets</option>
        <option value="discord">Discord</option>
        <option value="github">GitHub Issues</option>
        <option value="email">Email</option>
        <option value="twitter">X / Twitter</option>
        <option value="forum">Forums</option>
      </select>
      <select class="filter-select" data-filter="sentiment">
        <option value="">All Sentiment</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>
      <select class="filter-select" data-filter="urgency">
        <option value="">All Urgency</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select class="filter-select" data-filter="status">
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="ongoing">Ongoing</option>
        <option value="resolved">Resolved</option>
      </select>
      <input class="filter-input" data-filter="assignee" type="text" placeholder="Filter by assignee...">
    </section>

    <section class="feedback-list" id="feedback-list">
      <div class="empty-state">Loading...</div>
    </section>
  </main>

  <div class="modal-overlay hidden" id="add-modal" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <h2>Add Feedback</h2>
      <form id="add-form" onsubmit="submitFeedback(event)">
        <div class="form-group">
          <label for="f-source">Source</label>
          <select id="f-source" name="datasource" required>
            <option value="support_ticket">Support Ticket</option>
            <option value="discord">Discord</option>
            <option value="github">GitHub Issue</option>
            <option value="email">Email</option>
            <option value="twitter">X / Twitter</option>
            <option value="forum">Forum</option>
          </select>
        </div>
        <div class="form-group">
          <label for="f-url">Source URL (optional)</label>
          <input type="url" id="f-url" name="url" placeholder="https://...">
        </div>
        <div class="form-group">
          <label for="f-content">Feedback Content</label>
          <textarea id="f-content" name="content" required placeholder="Enter the customer feedback..."></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-ghost" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const filters = { datasource: '', sentiment: '', urgency: '', status: '', assignee: '' };
    const sourceNames = {
      discord: 'Discord', github: 'GitHub', twitter: 'X/Twitter',
      email: 'Email', support_ticket: 'Support', forum: 'Forum'
    };

    async function init() {
      await Promise.all([loadStats(), loadFeedback()]);
      document.querySelectorAll('.filter-select').forEach(function(sel) {
        sel.addEventListener('change', function(e) {
          filters[e.target.dataset.filter] = e.target.value;
          loadFeedback();
        });
      });
      document.querySelectorAll('.filter-input').forEach(function(inp) {
        inp.addEventListener('change', function(e) {
          filters[e.target.dataset.filter] = e.target.value;
          loadFeedback();
        });
      });
    }

    async function loadStats() {
      try {
        var res = await fetch('/api/stats');
        var json = await res.json();
        var d = json.data;
        document.getElementById('stat-total').textContent = d.total || 0;
        var sm = {}; (d.bySentiment||[]).forEach(function(r){sm[r.sentiment||'unknown']=r.count;});
        document.getElementById('stat-positive').textContent = sm.positive || 0;
        document.getElementById('stat-negative').textContent = sm.negative || 0;
        document.getElementById('stat-neutral').textContent = sm.neutral || 0;
        var um = {}; (d.byUrgency||[]).forEach(function(r){um[r.urgency||'unknown']=r.count;});
        document.getElementById('stat-critical').textContent = um.critical || 0;
        document.getElementById('stat-high').textContent = um.high || 0;
        var stm = {}; (d.byStatus||[]).forEach(function(r){stm[r.status]=r.count;});
        document.getElementById('stat-new').textContent = stm['new'] || 0;
        document.getElementById('stat-resolved').textContent = stm.resolved || 0;
      } catch(e) { console.error('Failed to load stats', e); }
    }

    async function loadFeedback() {
      try {
        var params = new URLSearchParams();
        Object.keys(filters).forEach(function(k){ if(filters[k]) params.set(k, filters[k]); });
        var res = await fetch('/api/feedback?' + params.toString());
        var json = await res.json();
        renderFeedback(json.data || []);
      } catch(e) {
        document.getElementById('feedback-list').innerHTML = '<div class="empty-state">Failed to load feedback.</div>';
      }
    }

    function renderFeedback(items) {
      var container = document.getElementById('feedback-list');
      if (!items.length) {
        container.innerHTML = '<div class="empty-state">No feedback found. Click "Seed Demo Data" to populate.</div>';
        return;
      }
      container.innerHTML = items.map(renderCard).join('');
    }

    function renderCard(item) {
      var tags = [];
      try { tags = item.tags ? JSON.parse(item.tags) : []; } catch(e) {}
      var date = new Date(item.created_at + (item.created_at.endsWith('Z') ? '' : 'Z'));
      var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var updatedDate = item.updated_at ? new Date(item.updated_at + (item.updated_at.endsWith('Z') ? '' : 'Z')) : null;
      var updatedStr = updatedDate ? updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
      var showUpdated = updatedStr && updatedStr !== dateStr;
      var stClass = 'st-' + (item.status || 'new');
      return '<div class="card">' +
        '<div class="card-header">' +
          '<span class="badge source-' + esc(item.datasource) + '">' + esc(sourceNames[item.datasource]||item.datasource) + '</span>' +
          (item.sentiment != null ? '<span class="badge ' + sentimentClass(item.sentiment) + '">' + formatSentiment(item.sentiment) + '</span>' : '') +
          (item.urgency != null ? '<span class="badge urgency-' + urgencyLabel(item.urgency) + '">' + urgencyLabel(item.urgency) + '</span>' : '') +
          '<select class="status-select ' + stClass + '" onchange="updateStatus(' + item.id + ',this.value)">' +
            '<option value="new"' + (item.status==='new'?' selected':'') + '>New</option>' +
            '<option value="ongoing"' + (item.status==='ongoing'?' selected':'') + '>Ongoing</option>' +
            '<option value="resolved"' + (item.status==='resolved'?' selected':'') + '>Resolved</option>' +
          '</select>' +
        '</div>' +
        '<p class="card-content">' + esc(item.content) + '</p>' +
        (item.summary
          ? '<div class="card-summary"><strong>AI Summary:</strong> ' + esc(item.summary) + '</div>'
          : '<div class="card-summary pending">Analysis pending...</div>') +
        '<div class="card-assignee">' +
          '<span class="assignee-label">Assignee:</span>' +
          '<input class="assignee-input" type="text" value="' + esc(item.assignee || '') + '" placeholder="Unassigned" onchange="updateAssignee(' + item.id + ',this.value)">' +
        '</div>' +
        '<div class="card-footer">' +
          '<div class="tags">' + tags.map(function(t){return '<span class="tag">' + esc(t) + '</span>';}).join('') + '</div>' +
          '<div class="card-meta">' +
            (item.url ? '<a href="' + esc(item.url) + '" target="_blank" rel="noopener" class="source-link">View source</a>' : '') +
            '<span>' + dateStr + (showUpdated ? ' · Updated ' + updatedStr : '') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function sentimentClass(val) {
      var n = Number(val);
      if (n > 0.3) return 'sentiment-positive';
      if (n < -0.3) return 'sentiment-negative';
      return 'sentiment-neutral';
    }

    function formatSentiment(val) {
      var n = Number(val);
      var label = n > 0.3 ? 'positive' : n < -0.3 ? 'negative' : 'neutral';
      return n.toFixed(2) + ' (' + label + ')';
    }

    function urgencyLabel(val) {
      var labels = {1:'low', 2:'medium', 3:'high', 4:'critical'};
      return labels[val] || 'unknown';
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s || '';
      return d.innerHTML;
    }

    async function updateAssignee(id, assignee) {
      await fetch('/api/feedback/' + id, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({assignee: assignee || null})
      });
    }

    async function updateStatus(id, status) {
      await fetch('/api/feedback/' + id, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({status: status})
      });
      await Promise.all([loadStats(), loadFeedback()]);
    }

    async function seedData() {
      var btn = document.getElementById('seed-btn');
      btn.disabled = true;
      btn.textContent = 'Seeding...';
      try {
        await fetch('/api/seed', {method:'POST'});
        await Promise.all([loadStats(), loadFeedback()]);
      } catch(e) { console.error('Seed failed', e); }
      btn.disabled = false;
      btn.textContent = 'Seed Demo Data';
    }

    async function submitFeedback(e) {
      e.preventDefault();
      var form = e.target;
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          datasource: form.datasource.value,
          url: form.url.value,
          content: form.content.value
        })
      });
      form.reset();
      closeModal();
      await Promise.all([loadStats(), loadFeedback()]);
    }

    function openModal() { document.getElementById('add-modal').classList.remove('hidden'); }
    function closeModal() { document.getElementById('add-modal').classList.add('hidden'); }

    init();
  </script>
</body>
</html>`;
}
