using SignalRStocksBackend.DTOs;
using SignalRStocksBackend.Entities;

namespace SignalRStocksBackend.Services;

public class StockService
{
    private readonly StockContext db;

    public StockService(StockContext db)
    {
        this.db = db;
    }

    public Transaction AddTransaction(string username, string shareName, int amount, bool isBuy)
    {
        var share = db.Shares.FirstOrDefault(share => share.Name.Equals(shareName));
        var user = db.Users.FirstOrDefault(user => user.Name.Equals(username));
        if (share == null || user == null) return null;

        var price = amount * share.StartPrice;
        var userShare = db.UserShares.FirstOrDefault(us => us.User.Equals(user) && us.Share.Equals(share));

        if (isBuy)
        {
            if (price > user.Cash) return null;
            if (userShare == null)
            {
                db.UserShares.Add(new UserShare
                {
                    User = user,
                    Share = share,
                    Amount = amount
                });
            }
            else
            {
                userShare.Amount += amount;
            }

            user.Cash -= price;
            db.SaveChanges();
        }
        else
        {
            if (userShare == null || userShare.Amount < amount) return null;
            if (userShare.Amount == amount) db.UserShares.Remove(userShare);
            else userShare.Amount -= amount;

            user.Cash += price;
            db.SaveChanges();
        }

        var transaction = new Transaction
        {
            Share = share,
            Amount = amount,
            User = user,
            Timestamp = DateTime.Now,
            UnitPrice = share.StartPrice,
            IsUserBuy = isBuy
        };
        db.Transactions.Add(transaction);
        db.SaveChanges();

        return transaction;
    }

    public IEnumerable<ShareTickDto> GetAllShares()
    {
        return db.Shares.Select(share => new ShareTickDto
        {
            Name = share.Name,
            Val = share.StartPrice
        });
    }

    public double GetCash(string name)
    {
        return db.Users.FirstOrDefault(user => user.Name.Equals(name))?.Cash ?? 0;
    }

    public IEnumerable<DepotDto> GetDepots(string name)
    {
        return db.UserShares.Where(share => share.User.Name.Equals(name))
            .Select(share => new DepotDto
            {
                ShareName = share.Share.Name,
                Amount = share.Amount
            });
    }
}
