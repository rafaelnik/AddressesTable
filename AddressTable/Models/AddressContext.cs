using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace AddressTable.Models
{
    public class AddressContext : DbContext
    {
        public DbSet<Address> Addresses { get; set; }
    }
}