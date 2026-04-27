const mongoose = require("mongoose");
const { processReturn } = require("../../services/rentalFinanceService.js");

async function returnBook(req, res) {
  const rentalId = req.params.id || req.body.rentalId;
  const condition = String(req.body.condition || "").trim().toLowerCase();
  const damagePercentageRaw = req.body.damagePercentage;
  const adminNote = String(req.body.adminNote || "").trim();

  if (!rentalId || !mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ error: "A valid rental id is required" });
  }

  if (!["good", "minor", "major", "lost"].includes(condition)) {
    return res.status(400).json({ error: "condition must be good, minor, major, or lost" });
  }

  const damagePercentage =
    damagePercentageRaw === undefined || damagePercentageRaw === null || damagePercentageRaw === ""
      ? null
      : Number(damagePercentageRaw);

  try {
    const result = await processReturn({
      rentalId,
      condition,
      damagePercentage,
      adminNote,
    });

    if (!result.ok) {
      return res.status(result.status || 400).json({ error: result.message });
    }

    return res.status(200).json({
      message: "Return processed successfully",
      returnSummary: {
        rentalId: result.rentalId,
        returnedAt: result.returnedAt,
        status: result.status,
        condition: result.condition,
        damageCharge: result.damageCharge,
        depositRefund: result.depositRefund,
        extraWalletDeduction: result.extraWalletDeduction,
        pendingDue: result.pendingDue
          ? {
              _id: result.pendingDue._id,
              amount: result.pendingDue.amount,
              reason: result.pendingDue.reason,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Return book error:", error);
    return res.status(500).json({ error: "Unable to process return" });
  }
}

module.exports = { returnBook };
