import { config } from "dotenv";
config({ path: "../../.env" });

import twilio from "twilio";
import { db, settingsTable } from "@workspace/db";

async function testTwilio() {
  console.log("Fetching settings from database...");
  
  try {
    const settingsList = await db.select().from(settingsTable).limit(1);
    const settings = settingsList[0];
    
    if (!settings) {
      console.log("❌ No settings found in database.");
      return;
    }

    console.log("Settings found:");
    console.log("- Account SID:", settings.twilioAccountSid ? "Set (Starts with " + settings.twilioAccountSid.substring(0, 4) + ")" : "Not set");
    console.log("- Auth Token:", settings.twilioAuthToken ? "Set" : "Not set");
    console.log("- From Number:", settings.twilioFromNumber);
    console.log("- To Number:", settings.twilioToNumber);
    console.log("- Twilio Enabled:", settings.twilioEnabled);

    if (!settings.twilioAccountSid || !settings.twilioAuthToken) {
      console.log("❌ Missing Twilio credentials in settings.");
      return;
    }

    console.log("\nAttempting to send a test message to Twilio...");
    const client = twilio(settings.twilioAccountSid, settings.twilioAuthToken);
    
    const message = await client.messages.create({
      body: "Hello from Titan X! This is a test message.",
      from: settings.twilioFromNumber,
      to: settings.twilioToNumber
    });

    console.log("✅ Message sent successfully! SID:", message.sid);
  } catch (error) {
    console.log("\n❌ Failed to send message.");
    console.log("Error details:");
    console.log(error);
  } finally {
    process.exit(0);
  }
}

testTwilio();
