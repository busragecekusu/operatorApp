const ticketTemplate = (data) => `
<html >
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      font-size: 14px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      height: 60px;
    }
    .title {
      text-align: center;
      font-size: 18px;
      margin: 20px 0;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
    .section {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
    }
    .row {
      display: flex;
      justify-content: space-between;
    }
    .row .col {
      width: 32%;
    }
    .note {
      font-size: 12px;
      margin-top: 30px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
  </style>
</head>
<body>

  <div class="header">
    <img class="logo" src="https://i.ibb.co/XZwsc6S/tatlicence.png" alt="TAT Licence" />
    <img class="logo" src="https://i.ibb.co/FK9TyJs/orcalogo.png" alt="ORCA Softwares" />
    <div><strong>ID:</strong> 2342545</div>
  </div>

  <div class="section">
    <p><strong>The Orca travel co.ltd</strong><br />
    Address: 50/70, patong sahil yolu, Dolphin caddesi, selvi sokak no: 23, phuket/thailand<br />
    Phone numbers: +6687459574, +66897894597</p>
  </div>

  <div class="title">Voucher</div>

  <div class="section">
    <p><span class="label">Product name:</span> Premium phi phi islands tour full day with speed catamaran</p>
  </div>

  <div class="section">
    <p><span class="label">Booking ID:</span> B4235353635</p>
    <p><span class="label">Name:</span> Anastasiya selevekova</p>
  </div>

  <div class="section row">
    <div class="col"><span class="label">Adult:</span> 3</div>
    <div class="col"><span class="label">Child:</span> 3</div>
    <div class="col"><span class="label">Infant:</span> 3</div>
  </div>

  <div class="section">
    <p><span class="label">Pick-Up:</span> Anantara wellness & spa hote and resort  patong</p>
  </div>

  <div class="section row">
    <div class="col"><span class="label">Room:</span> 1200</div>
    <div class="col"><span class="label">Paid:</span> 1200</div>
    <div class="col"><span class="label">Cash on Tour:</span> 3400 baht</div>
  </div>

  <div class="section">
    <p><span class="label">Customer phone number:</span> +6698585934885</p>
    <p><span class="label">Driver phone number:</span> +6698585934885</p>
  </div>

  <div class="section">
    <p><span class="label">Special requirements:</span><br />
    öğle yemeği olarak helal ve vejeteryan yemek istiyorum.</p>
  </div>

  <div class="section">
    <p><span class="label">Operator</span> Kamil Koc Turizm Limited şirketi</p>
  </div>

  <div class="note">
    <p><strong>Note</strong><br />
    Cancellations before 24 hours to start time, not refundable<br />
    Cancellations due to other reason please contact us</p>
  </div>

</body>
</html>
`;

export default ticketTemplate;
