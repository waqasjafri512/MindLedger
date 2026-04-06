import dotenv from 'dotenv';
dotenv.config();

import { askGrok } from './src/lib/grok';

async function testGrok() {
  console.log('Testing Grok integration...');
  console.log('API Key:', process.env.XAI_API_KEY?.slice(0, 5) + '...');
  
  try {
    const res = await askGrok('Hello, are you functional?', 'You are a helpful assistant.');
    console.log('SUCCESS:', res);
  } catch (err: any) {
    console.log('FAILURE:', err.message || err);
  }
}

testGrok();
