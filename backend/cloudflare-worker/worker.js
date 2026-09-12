export default {
  async fetch(request, env) {
    const allowed = new Set(['https://1v1-lol-unbloked.github.io']);
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.has(origin) ? origin : 'https://1v1-lol-unbloked.github.io',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
    if (request.method !== 'POST') return json({error:'POST only'},405,cors);
    if (origin && !allowed.has(origin)) return json({error:'Origin not allowed'},403,cors);
    if (!env.OPENAI_API_KEY) return json({error:'OPENAI_API_KEY missing'},500,cors);

    let body;
    try { body = await request.json(); } catch { return json({error:'Invalid JSON'},400,cors); }
    const prompt = String(body.prompt || '').trim().slice(0,500);
    const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0,30).map(g => ({
      id:g.id, name:String(g.name||'').slice(0,100), category:String(g.category||'').slice(0,50),
      genre:String(g.genre||'').slice(0,100), popularity:String(g.popularity||'').slice(0,30),
      about:String(g.about||'').slice(0,420)
    })) : [];
    if (!prompt || !candidates.length) return json({error:'Invalid request'},400,cors);

    const openai = await fetch('https://api.openai.com/v1/responses', {
      method:'POST',
      headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:'You are a game recommendation engine for an unblocked browser games catalog. Choose up to 6 games ONLY from the supplied candidates. Never invent IDs or games. Prefer intent fit over raw popularity. Return ONLY valid JSON in this exact shape: {"picks":[{"id":123,"reason":"Short reason under 12 words"}]}. No markdown.',
        input:`User request: ${prompt}\n\nCandidate games:\n${JSON.stringify(candidates)}`,
        max_output_tokens:700
      })
    });
    if (!openai.ok) return json({error:'OpenAI request failed',status:openai.status},502,cors);
    const data = await openai.json();
    let text='';
    for (const item of (data.output || [])) for (const c of (item.content || [])) if (c.type === 'output_text') text += c.text || '';
    text=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
    let parsed;
    try { parsed=JSON.parse(text); } catch { return json({error:'Invalid AI response'},502,cors); }
    const valid = new Set(candidates.map(g=>String(g.id)));
    const picks = (Array.isArray(parsed.picks)?parsed.picks:[]).filter(p=>valid.has(String(p.id))).slice(0,6).map(p=>({id:p.id,reason:String(p.reason||'').slice(0,120)}));
    return json({picks},200,cors);
  }
};
function json(data,status,headers){ return new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}}); }
