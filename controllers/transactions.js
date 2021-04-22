const Transaction = require('../models/Transaction');

// @desc : Get all Transactions
// @route: /api/v1/transactions
// @access public
exports.getTranscations = async (req, res,next)=>{
  try {
        const transactions = await Transaction.find();
        return res.status(200).json({
            success: true,
            count : transactions.length,
            data : transactions
        })
    } catch (err) {
        return res.status(500).json({
            success: true,
            error : 'Server Error'
        })
    }
}

// @desc : Add Transaction
// @route: /api/v1/transactions
// @access Public
exports.addTranscation = async(req, res,next)=>{
    try {
        const{text,amount} = req.body;

        const transaction= await Transaction.create(req.body);

        return res.status(201).json({
            status : true,
            data : transaction
        });
    } catch (err) {
        console.log(err)
        if(err.name === "ValidationError")
        {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success : false,
                error : messages
            })
        }
        else{
            return res.status(500).json({
                error : 'Server Error'
            })
        }
        
    }
    }

// @desc : Delete Transaction
// @route: /api/v1/transactions/:id
// @access Public
exports.deleteTransactions =async (req, res,next)=>{
    try {
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction){
            return res.status(404).json({
                success : false,
                message : "Trnasction Not Found"
                
            })
        }

        await transaction.remove();

        return res.status(201).json({
            success : true,
            data : {}
        })
    } catch (err) {
        return res.status(500).json({
            error : 'Server Error'
        })
    }
    }