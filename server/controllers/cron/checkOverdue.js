const { applyOverdueCharges } = require("../../services/rentalFinanceService.js");

async function checkOverdue(req, res) {
  try {
    const results = await applyOverdueCharges(new Date());

    return res.status(200).json({
      message: "Overdue check completed",
      processedCount: results.length,
      results,
    });
  } catch (error) {
    console.error("Check overdue error:", error);
    return res.status(500).json({ error: "Unable to run overdue check" });
  }
}

module.exports = { checkOverdue };
