const webhookUrl = "https://discord.com/api/webhooks/1472658962317967443/KfhTAoVf5Y-f3H9xEdOHWSSPxU6PXyuarkl54EVMGtUBRTIuLJqcicKCb63JGchShGac";

async function sendNewPurchaseAlert(order) {
  const payload = {
    username: "BerryBox.cloud Store",
    avatar_url: "https://berrybox.cloud/Berry_Box_Logo.png",
    embeds: [
      {
        title: "🛒 Someone on the Checkout page",
        color: 'ffe599', 
        fields: [
          {
            name: "Customer",
            value: order.customerName,
            inline: true
          },
          {
            name: "Order ID",
            value: order.orderId,
            inline: true
          },
          {
            name: "Total",
            value: `$${order.total}`,
            inline: true
          },
          {
            name: "Items",
            value: `${order.items}`,
          }
        ],
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Failed to send webhook:", error);
  }
}


module.exports = {sendNewPurchaseAlert}
// Example usage
// sendNewPurchaseAlert({
//   customerName: "John Doe",
//   orderId: "ORD-12345",
//   total: 89.99,
//   items: [
//     { name: "T-Shirt", quantity: 2 },
//     { name: "Hat", quantity: 1 }
//   ]
// });
