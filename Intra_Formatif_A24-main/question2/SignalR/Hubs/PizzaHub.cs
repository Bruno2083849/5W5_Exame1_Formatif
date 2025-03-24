using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        public static class UserHandler
        {
            public static HashSet<string> ConnectedIds = new HashSet<string>();
        }

        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //maybe to delete
            //await base.OnConnectedAsync();


            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            string groupName = Enum.GetName(typeof(PizzaChoice), choice);
            int nbPi = _pizzaManager.NbPizzas[(int)choice];
            int prixPizza = _pizzaManager.PIZZA_PRICES [(int)choice];
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            int money = _pizzaManager.Money[(int)choice];
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", prixPizza, nbPi,groupName, money);
            
           
        }

        public async Task UnselectChoice(PizzaChoice choice)
        {

            
            string groupName = Enum.GetName(typeof(PizzaChoice), choice);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("quiteGroupe", groupName);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            string groupName = Enum.GetName(typeof(PizzaChoice), choice);

            string connectionId = Context.ConnectionId;

            _pizzaManager.IncreaseMoney(choice);
            int money = _pizzaManager.Money[(int)choice];
            await Clients.Group(groupName).SendAsync("UpdateMoney", money);
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);
            int money = _pizzaManager.Money[(int)choice];
            string groupName = Enum.GetName(typeof(PizzaChoice), choice);

            int prixPizza = _pizzaManager.PIZZA_PRICES[(int)choice];
            int nbPi = _pizzaManager.NbPizzas  [(int)choice];
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", prixPizza, nbPi, groupName, money);
           // await Clients.Group(groupName).SendAsync("UpdateMoney", money);
        }
    }
}
