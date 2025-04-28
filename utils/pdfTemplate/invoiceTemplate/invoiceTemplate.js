const invoiceTemplate = (data) => `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        padding: 20px;
        color: #333;
      }
      .flex {
        display: flex;
        justify-content: space-between;
      }
      .box {
        border: 1px solid #ccc;
        padding: 10px;
        box-sizing: border-box;
      }
      .logo-box {
        width: 200px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #aaa;
      }
      .invoice-info {
        width: 230px;
        font-size: 12px;
      }
      .half-box {
        width: 48%;
      }
      .right-box-title {
        font-weight: bold;
        margin-bottom: 3px;
        font-size: 13px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0;
        font-size: 12px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        vertical-align: top;
        text-align: left;
        font-weight: normal;
      }
      th {
        background-color: #f9f9f9;
      }
      .cell-content {
        min-height: 60px;
      }
      .bank-box {
        margin-top: 20px;
        font-size: 12px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
      }
      .summary-box {
        margin-top: 10px;
        border: 1px solid #ccc;
        width: 250px;
        float: right;
        text-align: right;
        padding: 10px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
      }
      .summary-label {
        font-weight: bold;
        margin-right: 20px;
      }
      .company-title {
        font-weight: bold;
        font-size: 13px;
      }
      .bold {
        font-weight: bold;
      }
      .status {
        margin-top: 5px;
        font-weight: bold;
        font-size: 14px;
      }
      .paid {
        color: green;
      }
      .unpaid {
        color: red;
      }
      .status-stamp {
        position: absolute;
        top: 80px;
        right: 50px;
        transform: rotate(-15deg);
        font-size: 28px;
        font-weight: bold;
        padding: 10px 20px;
        border: 5px solid;
        border-radius: 10px;
        opacity: 0.7;
      }
    </style>
  </head>
  <body>
    <div class="flex" style="margin-bottom: 10px;">
      <div class="logo-box box">Logo</div>
      <div class="invoice-info box">
        <div><strong>Invoice date</strong>: ${data.invoiceDate || "12 may 2024"}</div>
        <div><strong>Invoice Number</strong>: ${data.invoiceNumber || "26153445445"}</div>
        <div class="status ${data.isPaid ? 'paid' : 'unpaid'}">
          <strong>Status</strong>: ${data.isPaid ? 'PAID' : 'UNPAID'}
        </div>
      </div>
    </div>

    ${data.isPaid === false ? 
      `<div class="status-stamp unpaid">UNPAID</div>` : 
      ''}

    <div class="flex" style="margin-bottom: 20px;">
      <div class="left-box box half-box">
        <div class="company-title">${data.company?.name || "Yılmaz kaan travel Co.,ltd"}</div>
        ${data.company?.address || "12,12 sokak, gazi mahallesi, askerler caddesi"}<br/>
        TAT License: ${data.company?.tatLicense || "1234454"}<br/>
        VAT: ${data.company?.vat || "234235345346546"}<br/>
        Phone Numbers: ${data.company?.phone || "49576984567"}
      </div>

      <div class="half-box">
        <div class="right-box-title">Billing to:</div>
        <div class="right-box box">
          <strong>${data.billing?.name || "Mehmet Polatkol Co.,ltd"}</strong><br/>
          ${data.billing?.address || "12,12 sokak, gazi mahallesi, (askerler caddesi)"}<br/>
          TAT License: ${data.billing?.tatLicense || "1234454"}<br/>
          VAT: ${data.billing?.vat || "234235345346546"}<br/>
          Phone Numbers: ${data.billing?.phone || "49576984567"}
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Products</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>COT</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${data.products && data.products.length > 0 ? 
          data.products.map(product => `
            <tr>
              <td>${product.date || "24/10/2024"}</td>
              <td>
                <strong>${product.name || ""}</strong>
              </td>
              <td>${product.adultChildInfant || product.quantity || ""}</td>
              <td>$${product.unitPrice?.toFixed(2) || "0.00"}</td>
              <td>$${((product.total * 0.07) / (1 + 0.07)).toFixed(2) || "0.00"}</td>
              <td>$${product.total?.toFixed(2) || "0.00"}</td>
            </tr>
          `).join('') :
          `<tr>
            <td>24/10/2024</td>
            <td>
              <strong>istanbul Antalya transfer</strong>
            </td>
            <td>Adults</td>
            <td>$50.00</td>
            <td>$3.27</td>
            <td>$100.00</td>
          </tr>`
        }
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-row">
        <span class="summary-label">Sub-Total</span>
        <span>$${data.subtotal?.toFixed(2) || "100.00"}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">VAT %7</span>
        <span>$${data.vat?.toFixed(2) || "7.00"}</span>
      </div>
      <div class="summary-row" style="border-top: 1px solid #ccc; padding-top: 5px; margin-top: 5px;">
        <span class="summary-label">TOTAL</span>
        <span>$${data.total?.toFixed(2) || "107.00"}</span>
      </div>
    </div>

    <div style="clear: both;"></div>

    <div class="bank-box">
      <p class="bold">Transfer to:</p>
      ${data.bankDetails?.bankName || "Kasikorn bank"}<br/>
      ${data.bankDetails?.accountName || "hakan kizilkaya"}<br/>
      account number: ${data.bankDetails?.accountNumber || "1242343543"}
    </div>

    <div class="footer">
      <p>This invoice prepared by<br/>
      <strong>${data.preparedByTitle || "General manager"}</strong><br/>
      ${data.preparedBy || "hakan kızılkaya"}</p>
    </div>
  </body>
</html>
`;

export default invoiceTemplate;
