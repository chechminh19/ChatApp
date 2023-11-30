using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IDictionary<string, UserRoomConnect> _connect;

        public ChatHub(IDictionary<string, UserRoomConnect> connect)
        {
            _connect = connect;
        }

        public async Task JoinRoom(UserRoomConnect userRoomConnect)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRoomConnect.Room!);            
            _connect[Context.ConnectionId] = userRoomConnect;
            await Clients.Group(userRoomConnect.Room!).SendAsync("ReceiveMessage", $"{userRoomConnect.User}", $"{userRoomConnect.User} has joined",DateTime.Now,$"{userRoomConnect.Room}");
            await SendConnectedUser(userRoomConnect.Room!);
        }
        public async Task SendMessage(string mess)
        {
            if(_connect.TryGetValue(Context.ConnectionId, out UserRoomConnect userRoomConnect))
            {
                await Clients.Group(userRoomConnect.Room!)
                    .SendAsync("ReceiveMessage", userRoomConnect.User, mess, DateTime.Now, userRoomConnect.Room);
            }
        }
        public override Task OnDisconnectedAsync(Exception? exp)
        {
            if (exp != null)
            {
                // Handle the exception here
                return base.OnDisconnectedAsync(exp);
            }
            // Remove the user from the chat room
            if (!_connect.TryGetValue(Context.ConnectionId, out UserRoomConnect userRoom))
            {
                return base.OnDisconnectedAsync(exp);
            }
            Clients.Group(userRoom.Room!).SendAsync("ReceiveMessage", "Let's program Bot", $"{userRoom.User} has left the group", DateTime.Now);
            // Update connected users in the room
            SendConnectedUser(userRoom.Room!);

            return base.OnDisconnectedAsync(exp);
        }
        public Task SendConnectedUser(string room)
        {
            var listt = _connect.Values.Where(r => r.Room == room).Select(r => r.User).ToList();
            return Clients.Group(room).SendAsync("ConnnectedUser", listt);
        }
    }
}
