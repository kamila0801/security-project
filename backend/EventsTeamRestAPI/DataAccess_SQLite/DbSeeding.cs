using Core.Models;
using Security.Enums;
using Security.IServices;

namespace DataAccess_SQLite;

public class DbSeeding
{
  private MainDbContext _ctx;
  private ISecurityService _securityService;
  public DbSeeding(MainDbContext ctx, ISecurityService securityService)
  {
    _ctx = ctx;
    _securityService = securityService;
  }
  
  public void SeedDevelopment()
  {
    _ctx.Database.EnsureDeleted();
    _ctx.Database.EnsureCreated();

    Permission p1 = new Permission() {Id = 1, Name = "EVENT_CREATE"};
    Permission p2 = new Permission() {Id = 2, Name = "EVENT_UPDATE"};
    Permission p3 = new Permission() {Id = 3, Name = "EVENT_DELETE"};
    Permission p4 = new Permission() {Id = 4, Name = "ROLE_CREATE"};
    Permission p5 = new Permission() {Id = 5, Name = "ROLE_UPDATE"};
    Permission p6 = new Permission() {Id = 6, Name = "ROLE_DELETE"};
    Permission p7 = new Permission() {Id = 7, Name = "ORGANISATION_UPDATE"};
    Permission p8 = new Permission() {Id = 8, Name = "ORGANISATION_DELETE"};

    List<Permission> allPermissions = new List<Permission>{p1, p2, p3, p4, p5, p6, p7, p8};
    foreach (var permission in allPermissions)
    {
      _ctx.Permissions.Add(permission);
    }

    Category football = new Category() { Id = 1, Name = "Football" };
    Category poker = new Category() { Id = 2, Name = "Poker" };
    Category cooking = new Category() { Id = 3, Name = "Cooking" };
   
    _ctx.Category.Add(football);
    _ctx.Category.Add(poker);
    _ctx.Category.Add(cooking);

    _securityService.GenerateNewUser(AuthProvider.EmailPassword, "user1@eventsteam.com", "Molly", "Test", "pass", null, null);
    _securityService.GenerateNewUser(AuthProvider.EmailPassword, "user2@eventsteam.com", "Molly", "Test", "pass", null, null);

    var user1 = _ctx.User
      .FirstOrDefault(u => u.Id == 1);
    
    var user2 = _ctx.User
      .FirstOrDefault(u => u.Id == 2);

    var org1 = new Organisation()
    {
      Id = 1,
      Name = "Poker Fans Esbjerg", Address = "Test Address", PostCode = 6700, City = "Esbjerg", Email = "test@test.com",
      PhoneNumber = 11111111, Category = poker, Owner = user1, Description = "We play poker blah blah blah blah...", Events = new List<Event>(),
      Tagline = "We play poker!", ColorHex = "#991E3A", ImageUrl = "logo-1"
    };
    Role owner1 = new Role()
    {
      Id = 1, Name = "Owner", Organisation = org1, HierarchyLevel = 0,
      Users = new List<User>() {user1}, Permissions = allPermissions
    };
    user1.Roles.Add(owner1);
    org1.Roles.Add(owner1);
    _ctx.Roles.Add(owner1);

    var org2 = new Organisation()
    {
      Id = 2,
      Name = "Young stars", Address = "Test Address", PostCode = 6700, City = "Esbjerg", Email = "test@test.com",
      PhoneNumber = 11111111, Category = football, Owner = user2, Description = "The coolest place in Esbjerg and more and more and more...", Events = new List<Event>(),
      Tagline = "The coolest place in Esbjerg", ColorHex = "#CC1F41", ImageUrl = "logo-2"
    };
    Role owner2 = new Role()
    {
      Id = 2, Name = "Owner", Organisation = org2, HierarchyLevel = 0,
      Users = new List<User>() {user2}, Permissions = allPermissions
    };
    Role member1 = new Role()
    {
      Id = 3, Name = "Member", Organisation = org2, HierarchyLevel = 1,
      Users = new List<User>() {user1}
    };
    user2.Roles.Add(owner2);
    org2.Roles.Add(owner2);
    _ctx.Roles.Add(owner2);
    user1.Roles.Add(member1);
    org2.Roles.Add(member1);
    _ctx.Roles.Add(member1);
   
    var ticket1 = new Ticket() {Id = 1, Type = "Regular", Price = 150};
    var ticket2 = new Ticket() {Id = 2, Type = "Child", Price = 100};
    var ticket3 = new Ticket() {Id = 3, Type = "Regular", Price = 150};
    var ticket4 = new Ticket() {Id = 4, Type = "Child", Price = 100};
    var ticket5 = new Ticket() {Id = 5, Type = "Regular", Price = 150};
   
    var event1 = new Event()
    {
      Id = 1, Name = "Cards night",
      FullDescription = "Come to meet us this friday evening and lets spend some time together playing poker.", ShortDescription = "Blah blah bl;ah blah blah",
      Date = new DateTime(2023, 2, 28, 19, 30, 0), Organisation = org1, 
      Address = "Test Address", PostCode = 6700, City = "Esbjerg",
      ColorHex = "#CC1F41", ImageUrl = "logo-1", Tickets = new List<Ticket>()
    };
    
    var event2 = new Event()
    {
      Id = 2, Name = "Poker for children",
      FullDescription = "On Saturdays we meet with kids and show them how fun poker is.", ShortDescription = "We will have so much fun!",
      Date = new DateTime(2023, 4, 1, 10, 30, 0), Organisation = org1,
      Address = "Test Address", PostCode = 6700, City = "Esbjerg",
      ColorHex = "#CC1F41", ImageUrl = "logo-2", Tickets = new List<Ticket>()
    };
    
    var event3 = new Event()
    {
      Id = 3, Name = "Sunday match",
      FullDescription = "Our football team is playing against a club from Aarhus", ShortDescription = "Our football team is playing against a club from Aarhus",
      Date = new DateTime(2023, 3, 1, 10, 30, 0), Organisation = org2,
      Address = "Test Address", PostCode = 6700, City = "Esbjerg",
      ColorHex = "#CC1F41", ImageUrl = "logo-3", Tickets = new List<Ticket>()
    };

    var ticketId = 5;
    for (int i = 4; i < 64; i++)
    {
      var eventt = new Event(){
        Id = i, Name = "Cool event no " + i,
        FullDescription = "Our football team is playing against a club from Aarhus", ShortDescription = "Our football team is playing against a club from Aarhus",
        Date = new DateTime(2023, 3, 1, 10, 30, 0), Organisation = org2,
        Address = "Test Address", PostCode = 6700, City = "Esbjerg",
        ColorHex = "#CC1F41", ImageUrl = "logo-3", Tickets = new List<Ticket>()
      };
      ticketId++;
      var tickett1 = new Ticket() {Id = ticketId, Type = "Child", Price = 100};
      ticketId++;
      var tickett2 = new Ticket() {Id = ticketId, Type = "Regular", Price = 350};
      
      eventt.Tickets.Add(tickett1);
      eventt.Tickets.Add(tickett2);
      org2.Events.Add(eventt);
      _ctx.Event.Add(eventt);
      _ctx.Ticket.Add(tickett1);
      _ctx.Ticket.Add(tickett2);
    }
   
    event1.Tickets.Add(ticket1);
    event1.Tickets.Add(ticket2);
    event2.Tickets.Add(ticket3);
    event2.Tickets.Add(ticket4);
    event3.Tickets.Add(ticket5);
    
    org1.Events.Add(event1);
    org1.Events.Add(event2);
    org2.Events.Add(event3);
    
    _ctx.Organisation.Add(org1); 
    _ctx.Organisation.Add(org2);

    _ctx.Event.Add(event1);
    _ctx.Event.Add(event2);
    
    _ctx.Ticket.Add(ticket1);
    _ctx.Ticket.Add(ticket2);
    _ctx.Ticket.Add(ticket3);
    _ctx.Ticket.Add(ticket4);
    _ctx.Ticket.Add(ticket5);
    
    _ctx.SaveChanges();
  }
}