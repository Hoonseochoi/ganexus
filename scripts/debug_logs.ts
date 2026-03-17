import "dotenv/config";
import { query } from "../src/lib/engines/db";
import { getScheduleEditLogs } from "../src/lib/engines/schedules";

async function run() {
  try {
    const logsDb = await query("SELECT * FROM public.schedule_edit_logs LIMIT 5");
    console.log("Direct Query Results:");
    console.log(JSON.stringify(logsDb, null, 2));

    if (logsDb.length > 0) {
      const row = logsDb[0] as any;
      console.log(`\nTesting getScheduleEditLogs for ${row.schedule_id} / ${row.branch_name}`);
      const logs = await getScheduleEditLogs({ scheduleId: row.schedule_id, branchName: row.branch_name });
      console.log("Engine getScheduleEditLogs Results:");
      console.log(JSON.stringify(logs, null, 2));
    } else {
      console.log("No logs found in DB!");
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    process.exit(0);
  }
}
run();
