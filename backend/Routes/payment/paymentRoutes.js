const Transaction = require("../../Models/transaction/transactionSchema");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");

const router = require("express").Router();
const stripe = require("stripe")("sk_test_51HTOQGCH0xfOm9H95fTqnzn5FXJ004IjhWnpb7EtesBucXomOPnww0bmUmJ4hJWgATawLLW7UEngu9QaYDSFUlzi00qJb5ijjb");
const customLogger = require('../../utils/logHandler')

router.post("/intent", async (req, res) => {
  try {
    customLogger("user", "intent stripe payment", req)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'inr',
      payment_method_types: ['card'],
      description: 'Software development services',
      shipping: {
        name: 'Ritik Makhija',
        address: {
          line1: 'Presidency Aqua Boys Hostel 8th Cross Road Bhuvaneswari Nagar Dasarahalli',
          postal_code: '560092',
          city: 'Bengaluru',
          state: 'KA',
          country: 'IN',
        },
      },
    });
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(499).json({ message: 'Try after sometime...' })
  }
});

// Create a transaction
router.post("/transaction", [authenticateMiddleware], async (req, res) => {
  const { type, amount, paymentMethod } = req.body;

  try {
    customLogger("user", "new transaction initiated", req)
    const findOldTransaction = await Transaction.find({
      customer: req.user._id,
      status: 'Pending'
    }).exec();

    if (findOldTransaction.length === 0) {
      try {
        const newTransaction = new Transaction({
          type,
          amount,
          status: "Pending",
          paymentMethod,
          customer: req.user._id,
        });

        await newTransaction.save();

        // Delay the status update by 5 minutes
        setTimeout(async () => {
          const transaction = await Transaction.find({ _id: newTransaction._id });
          if (transaction.status === "Pending") {
            transaction.status = "Failed";
            await transaction.save();
            console.log(`Transaction ${transaction._id} has failed`);
          }
        }, 300000); // 5 minutes in milliseconds

        res.status(201).json({ transaction: newTransaction, status: 200 });
      } catch (error) {
        console.error(error);
        res.status(499).json({ message: "Kindly wait for a while..." });
      }
    } else {
      const oldTransaction = findOldTransaction[0];
      oldTransaction.status = 'Failed';
      await oldTransaction.save();

      // create new transaction
      const newTransaction = new Transaction({
        type,
        amount,
        status: "Pending",
        paymentMethod,
        customer: req.user._id
      });

      await newTransaction.save();

      // Delay the status update by 5 minutes
      setTimeout(async () => {
        const transaction = await Transaction.findById(newTransaction._id);
        if (transaction && transaction?.status === "Pending") {
          transaction.status = "Failed";
          await transaction.save();
          console.log(`Transaction ${transaction._id} has failed`);
        }
      }, 300000); // 5 minutes in milliseconds

      res.status(200).json({ transaction: newTransaction, status: 200 });

    }
  } catch (err) {
    console.log(err)
  }
});

// Update a transaction
router.put("/transaction/:transactionId", [authenticateMiddleware], async (req, res) => {
  const { status } =
    req.body;
  try {
    customLogger("user", `transaction updated:- ${status} - ${req.params.transactionId}`, req)
    const transaction = await Transaction.findOne({
      trans_id: req.params.transactionId
    });

    if (String(req.user._id) === String(transaction.customer)) {

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      transaction.status = status || transaction.status;

      const updatedTransaction = await transaction.save();

      res.status(200).json({ transaction: updatedTransaction, status: 200 });
    } else {
      res.status(499).json({ message: 'Something went wrong...', status: 499 })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Transactions
router.get("/transactions", [authenticateMiddleware], async (req, res) => {
  try {
    const transactions = await Transaction.find({ customer: req.user._id }).sort({ createdAt: -1 }).exec();
    res.status(200).json({ transactions, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
