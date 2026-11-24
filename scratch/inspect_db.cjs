const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const areas = await mongoose.connection.db.collection('serviceareas').find({}).toArray();
  console.log('Service Areas count:', areas.length);
  for (const a of areas) {
    console.log(a.slug, '| Title:', a.title, '| FAQs count:', a.faqs ? a.faqs.length : 0);
  }

  const services = await mongoose.connection.db.collection('services').find({}).toArray();
  console.log('\nServices count:', services.length);
  for (const s of services) {
    console.log(s.slug, '| Title:', s.title, '| FAQs count:', s.faqs ? s.faqs.length : 0);
  }

  const pages = await mongoose.connection.db.collection('pages').find({}).toArray();
  console.log('\nPages count:', pages.length);
  for (const p of pages) {
    console.log(p.slug, '| Title:', p.title);
  }

  process.exit(0);
}

check().catch(e => { console.error(e); process.exit(1); });
