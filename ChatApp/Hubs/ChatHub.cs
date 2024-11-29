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
            try
            {
                if (_connect.TryGetValue(Context.ConnectionId, out UserRoomConnect userRoomConnect))
                {                    
                    await Clients.Group(userRoomConnect.Room!)
                      .SendAsync("ReceiveMessage", userRoomConnect.User, mess, DateTime.Now, userRoomConnect.Room);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }
        //public async Task UploadImage(string fileData)
        //{
        //    try
        //    {
        //        if (_connect.TryGetValue(Context.ConnectionId, out UserRoomConnect userRoomConnect))
        //        {
        //            if (fileData != null)
        //            {   
        //                await Clients.Group(userRoomConnect.Room!)
        //                     .SendAsync("ReceiveMessage", userRoomConnect.User, fileData, DateTime.Now, userRoomConnect.Room);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Error.WriteLine($"Error: {ex.Message}");
        //        throw;
        //    }
        //}
        public override Task OnDisconnectedAsync(Exception? exp)
        {            
            
            if (!_connect.TryGetValue(Context.ConnectionId, out UserRoomConnect userRoom))
            {
                return base.OnDisconnectedAsync(exp);
            }
            _connect.Remove(Context.ConnectionId);
            Clients.Group(userRoom.Room!).SendAsync("ReceiveMessage", $"{userRoom.User}", $"{userRoom.User} has left the group", DateTime.Now, $"{userRoom.Room}");
            // Update connected users in the room
            SendConnectedUser(userRoom.Room!);

            return base.OnDisconnectedAsync(exp);
        }
        public Task SendConnectedUser(string room)
        {
            var listt = _connect.Values.Where(r => r.Room == room).Select(r => r.User).ToList();
            return Clients.Group(room).SendAsync("ConnectedUser", listt);
        }
    }
}
