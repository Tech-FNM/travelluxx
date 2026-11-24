const mongoose = require('mongoose');
const fs = require('fs');

const uri = process.env.MONGODB_URI || 'mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0';

async function syncAllToMongo() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Sync website settings
  if (fs.existsSync('website_settings.json')) {
    const webSettings = JSON.parse(fs.readFileSync('website_settings.json', 'utf8'));
    await db.collection('settings').updateOne(
      { key: 'website' },
      { $set: { key: 'website', value: webSettings } },
      { upsert: true }
    );
    console.log('✅ Synced website settings to MongoDB (faqs:', webSettings.homepage_faqs?.length || 0, ')');
  }

  // 2. Sync services page settings
  if (fs.existsSync('services_settings.json')) {
    const svcSettings = JSON.parse(fs.readFileSync('services_settings.json', 'utf8'));
    await db.collection('settings').updateOne(
      { key: 'services_page_settings' },
      { $set: { key: 'services_page_settings', value: svcSettings } },
      { upsert: true }
    );
    console.log('✅ Synced services_page_settings to MongoDB (faqs:', svcSettings.faqs?.length || 0, ')');
  }

  // 3. Sync service areas page settings
  if (fs.existsSync('service_areas_settings.json')) {
    const saSettings = JSON.parse(fs.readFileSync('service_areas_settings.json', 'utf8'));
    await db.collection('settings').updateOne(
      { key: 'service_areas_page_settings' },
      { $set: { key: 'service_areas_page_settings', value: saSettings } },
      { upsert: true }
    );
    console.log('✅ Synced service_areas_page_settings to MongoDB');
  }

  // 4. Verify service areas in MongoDB
  const areas = await db.collection('serviceareas').find({}).toArray();
  console.log('✅ Total serviceareas in MongoDB:', areas.length);

  // 5. Verify services in MongoDB
  const services = await db.collection('services').find({}).toArray();
  console.log('✅ Total services in MongoDB:', services.length);

  // 6. Verify pages in MongoDB
  const pages = await db.collection('pages').find({}).toArray();
  console.log('✅ Total pages in MongoDB:', pages.length);

  // 7. Verify posts in MongoDB
  const posts = await db.collection('posts').find({}).toArray();
  console.log('✅ Total posts in MongoDB:', posts.length);

  process.exit(0);
}

syncAllToMongo().catch(err => {
  console.error('Error syncing:', err);
  process.exit(1);
});
