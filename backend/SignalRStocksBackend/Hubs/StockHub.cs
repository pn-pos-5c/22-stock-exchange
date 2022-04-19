using Microsoft.AspNetCore.SignalR;
using SignalRStocksBackend.Services;

namespace SignalRStocksBackend.Hubs
{
    public class StockHub : Hub
    {
        private static int clientCount = 0;
        private readonly StockService stockService;

        public StockHub(StockService stockService)
        {
            this.stockService = stockService;
        }

        public override Task OnConnectedAsync()
        {
            clientCount++;
            Clients.All.SendAsync("ClientCountChanged", clientCount);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            clientCount--;
            Clients.All.SendAsync("ClientCoundChanged", clientCount);
            return base.OnDisconnectedAsync(exception);
        }

        public void BuyShare(string username, string shareName, int amount, bool isBuy)
        {
            var transaction = stockService.
        }
    }
}
