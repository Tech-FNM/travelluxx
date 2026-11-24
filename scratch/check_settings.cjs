const mongoose = require('mongoose');
const uri = 'mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const SettingSchema = new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }, { strict: false });
  const SettingModel = mongoose.model('Setting', SettingSchema);

  const website = await SettingModel.findOne({ key: 'website' });
  console.log('Website doc exists:', !!website);
  if (website && website.value) {
    console.log('Website value keys:', Object.keys(website.value));
    console.log('homepage_faqs count:', Array.isArray(website.value.homepage_faqs) ? website.value.homepage_faqs.length : 'none');
  } else {
    console.log('website doc value is empty');
  }

  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
