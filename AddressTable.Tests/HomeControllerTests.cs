using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using AddressTable.Controllers;
using System.Web.Mvc;

namespace AddressTable.Tests
{
    [TestClass]
    public class HomeControllerTests
    {
        [TestMethod]
        public void IndexViewResultNotNull()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetNumberOfPagesResultNotNull()
        {
            HomeController controller = new HomeController();

            int result = controller.GetNumberOfPages();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetAddressesResultNotNu()
        {
            HomeController controller = new HomeController();

            JsonResult result = controller.GetAddresses() as JsonResult;

            Assert.IsNotNull(result);
        }
    }
}
