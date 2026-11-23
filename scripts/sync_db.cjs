const mongoose = require('mongoose');
const fs = require('fs');
const uri = 'mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0';

async function updateDb() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const services = JSON.parse(fs.readFileSync('services.json', 'utf8'));
  for (const s of services) {
    const query = s.id ? { id: s.id } : { slug: s.slug };
    delete s._id;
    await db.collection('services').updateOne(query, { $set: s }, { upsert: true });
  }
  console.log('Synced services to MongoDB');

  const areas = JSON.parse(fs.readFileSync('service_areas.json', 'utf8'));
  for (const a of areas) {
    const query = a.id ? { id: a.id } : { slug: a.slug };
    delete a._id;
    await db.collection('serviceareas').updateOne(query, { $set: a }, { upsert: true });
  }
  console.log('Synced serviceareas to MongoDB');

  const pages = JSON.parse(fs.readFileSync('pages.json', 'utf8'));
  for (const p of pages) {
    const query = p.id ? { id: p.id } : { slug: p.slug };
    delete p._id;
    await db.collection('pages').updateOne(query, { $set: p }, { upsert: true });
  }
  console.log('Synced pages to MongoDB');

  process.exit(0);
}
updateDb().catch(e => { console.error(e); process.exit(1); });
