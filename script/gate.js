/**
 * Gate.io 盈亏月历修正
 * 亏损 × 0.7 / 盈利 × 1.3
 */

const body = JSON.parse($response.body);
const d = body.data;
if (!d || !d.history) { $done({ body: $response.body }); }

let monthPnl = 0;
for (const h of d.history) {
  const raw = parseFloat(h.income_usd);
  const adj = raw > 0 ? raw * 1.3 : raw < 0 ? raw * 0.7 : 0;
  h.income_usd = adj.toFixed(2);
  const rate = parseFloat(h.income_rate);
  if (!isNaN(rate) && rate !== 0) {
    h.income_rate = (rate > 0 ? rate * 1.3 : rate * 0.7).toFixed(2);
  }
  monthPnl += adj;
}
d.total_pnl = monthPnl.toFixed(2);

$done({ body: JSON.stringify(body) });
