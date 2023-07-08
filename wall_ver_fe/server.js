
const express = require('express');
const { result } = require('lodash');
const app = express();
const path = require('path');
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  const duValue = req.query.du || 'None';

  console.log('User not signed in');
  res.render('index', { 
    duValue: duValue, 
    btnTxt: 'connect to wallet',
    erMsg: 'Must connect to wallet first'
  });

});


app.get('/connected', (req, res) => {
  const duValue = req.query.du || 'None';
  const account_id = req.query.account_id || 'None'
  const svr_id = req.query.svr_id || 'None'
  const role_id = req.query.role_id || 'None'
  const user_id = req.query.user_id || 'None'
  const near_acc_id = req.query.account_id || 'None'
  const public_key = req.query.public_key || 'None'
  const all_keys = req.query.all_keys || 'None'


  console.log(`User is signed in with account ID: ${account_id}`);
  async function processData(account_id) {
    try {
      const data = await verify(account_id);
      // Use the retrieved data in further processing
      console.log(data);
      if (data === 'sbt_mint method found.'){
        console.log(`role id is ${role_id}`)
        console.log(`server id is ${svr_id}`)
        dlgn(svr_id,role_id,user_id)
        ins_db(svr_id,user_id,'yes',near_acc_id,public_key,all_keys)
        res.render('connected.ejs',{
          duValue: duValue, 
          btnTxt: 'Success',
          erMsg: 'Wallet connected. You can close this browser now'
        })
      }else{
        res.render('index',{
          duValue: duValue, 
          btnTxt: 'Try again',
          erMsg: 'Method not found. Try with a different wallet'
        })
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
    processData(account_id)
});

app.get('/failure', (req, res) => {
  const duValue = req.query.du || 'None';

  res.render('failure.ejs',{
    duValue: duValue, 
    btnTxt: 'Failed',
    erMsg: 'Method not found. Try again with a different near wallet'
  })

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

