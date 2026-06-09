export const revalidate = 0;

export async function GET() {
  try {
    const { getAllBlogPosts, getDb } = await import('../../../lib/db.js');
    const allPosts = await getAllBlogPosts();
    const sql = getDb();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWeekCount = allPosts.filter(
      (p) => p.created_at && new Date(p.created_at) > sevenDaysAgo,
    ).length;

    const koPosts = allPosts.filter((p) => p.lang === 'ko');
    const enPosts = allPosts.filter((p) => p.lang === 'en');

    const recent5 = [...allPosts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((p) => ({ title: p.title, slug: p.slug, date: p.date, lang: p.lang }));

    let emailSubscribers = 0;
    try {
      const rows = await sql`SELECT COUNT(*) as count FROM email_subscribers WHERE service = 'taskgrid'`;
      emailSubscribers = Number(rows[0]?.count ?? 0);
    } catch { /* ignore */ }

    return Response.json({
      service: 'taskgrid',
      domain: 'taskgrid.my',
      blog: { total: allPosts.length, ko: koPosts.length, en: enPosts.length, recentWeek: recentWeekCount, recent: recent5 },
      emailSubscribers,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
