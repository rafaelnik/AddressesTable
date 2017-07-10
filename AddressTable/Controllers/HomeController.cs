using AddressTable.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using NLog;

namespace AddressTable.Controllers
{
    public class HomeController : Controller
    {
        AddressContext db = new AddressContext();
        private static Logger logger = LogManager.GetCurrentClassLogger();

        // GET: Home
        public ActionResult Index()
        {
            try
            {
                IEnumerable<Address> addresses = db.Addresses;
                ViewBag.Addresses = JsonConvert.SerializeObject(addresses);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Ошибка при попытке чтения из БД.");
            }

            return View();
        }

        [HttpGet]
        public ActionResult GetAddresses()
        {
            int currentPage = 0;
            string countryFilter = "";
            string cityFilter = "";
            string streetFilter = "";
            string postcodeFilter = "";

            int houseFilter = 0;
            int minHouseRange = 0;
            int maxHouseRange = 0;
            DateTime startDate = new DateTime();
            DateTime endDate = new DateTime();

            string sortKey = "";
            bool reverseSort = false;

            try
            {
                currentPage = Int32.Parse(Request.Params["currentPage"]);
                countryFilter = Request.Params["countryFilter"];
                cityFilter = Request.Params["cityFilter"];
                streetFilter = Request.Params["streetFilter"];
                postcodeFilter = Request.Params["postcodeFilter"];

                Int32.TryParse(Request.Params["houseFilter"], out houseFilter);
                Int32.TryParse(Request.Params["minHouseRange"], out minHouseRange);
                Int32.TryParse(Request.Params["maxHouseRange"], out maxHouseRange);
                DateTime.TryParse(Request.Params["startDate"], out startDate);
                DateTime.TryParse(Request.Params["endDate"], out endDate);

                sortKey = Request.Params["sortKey"];
                reverseSort = Boolean.Parse(Request.Params["reverseSort"]);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Ошибка при парсинге данных запроса.");
            }

            try
            {
                IEnumerable<Address> addresses = db.Addresses.OrderBy(p => p.Id);

                switch (sortKey)
                {
                    case "Country":
                        addresses = addresses.OrderBy(p => p.Country);
                        break;
                    case "City":
                        addresses = addresses.OrderBy(p => p.City);
                        break;
                    case "Street":
                        addresses = addresses.OrderBy(p => p.Street);
                        break;
                    case "House":
                        addresses = addresses.OrderBy(p => p.House);
                        break;
                    case "Postcode":
                        addresses = addresses.OrderBy(p => p.Postcode);
                        break;
                    case "RecordDate":
                        addresses = addresses.OrderBy(p => p.RecordDate);
                        break;
                }

                if (reverseSort) addresses = addresses.Reverse();

                if ((countryFilter != "") && (countryFilter != null)) addresses = addresses.Where(p => p.Country.Contains(countryFilter));
                if ((cityFilter != "") && (cityFilter != null)) addresses = addresses.Where(p => p.City.Contains(cityFilter));
                if ((streetFilter != "") && (streetFilter != null)) addresses = addresses.Where(p => p.Street.Contains(streetFilter));
                if (houseFilter != 0) addresses = addresses.Where(p => p.House == houseFilter);
                if ((postcodeFilter != "") && (postcodeFilter != null)) addresses = addresses.Where(p => p.Postcode.ToString().Contains(postcodeFilter));

                if (minHouseRange != 0) addresses = addresses.Where(p => p.House >= minHouseRange);
                if (maxHouseRange != 0) addresses = addresses.Where(p => p.House <= maxHouseRange);

                if (startDate != new DateTime(1, 1, 1)) addresses = addresses.Where(p => p.RecordDate >= startDate);
                if (endDate != new DateTime(1, 1, 1)) addresses = addresses.Where(p => p.RecordDate <= endDate);

                addresses = addresses.Skip(100 * currentPage);
                JsonResult res = new JsonResult();

                return Json(addresses.Take(100), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Ошибка при попытке чтения из БД.");
                return Json(new Address());
            }
        }

        [HttpGet]
        public int GetNumberOfPages()
        {
            int currentPage = 0;
            string countryFilter = "";
            string cityFilter = "";
            string streetFilter = "";
            string postcodeFilter = "";

            int houseFilter = 0;
            int minHouseRange = 0;
            int maxHouseRange = 0;
            DateTime startDate = new DateTime();
            DateTime endDate = new DateTime();

            string sortKey = "";
            bool reverseSort = false;

            try
            {
                currentPage = Int32.Parse(Request.Params["currentPage"]);
                countryFilter = Request.Params["countryFilter"];
                cityFilter = Request.Params["cityFilter"];
                streetFilter = Request.Params["streetFilter"];
                postcodeFilter = Request.Params["postcodeFilter"];

                Int32.TryParse(Request.Params["houseFilter"], out houseFilter);
                Int32.TryParse(Request.Params["minHouseRange"], out minHouseRange);
                Int32.TryParse(Request.Params["maxHouseRange"], out maxHouseRange);
                DateTime.TryParse(Request.Params["startDate"], out startDate);
                DateTime.TryParse(Request.Params["endDate"], out endDate);

                sortKey = Request.Params["sortKey"];
                reverseSort = Boolean.Parse(Request.Params["reverseSort"]);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Ошибка при парсинге данных запроса.");
            }

            try
            {
                IEnumerable<Address> addresses = db.Addresses.OrderBy(p => p.Id);

                if ((countryFilter != "") && (countryFilter != null)) addresses = addresses.Where(p => p.Country.Contains(countryFilter));
                if ((cityFilter != "") && (cityFilter != null)) addresses = addresses.Where(p => p.City.Contains(cityFilter));
                if ((streetFilter != "") && (streetFilter != null)) addresses = addresses.Where(p => p.Street.Contains(streetFilter));
                if (houseFilter != 0) addresses = addresses.Where(p => p.House == houseFilter);
                if ((postcodeFilter != "") && (postcodeFilter != null)) addresses = addresses.Where(p => p.Postcode.ToString().Contains(postcodeFilter));

                if (minHouseRange != 0) addresses = addresses.Where(p => p.House >= minHouseRange);
                if (maxHouseRange != 0) addresses = addresses.Where(p => p.House <= maxHouseRange);

                if (startDate != new DateTime(1, 1, 1)) addresses = addresses.Where(p => p.RecordDate >= startDate);
                if (endDate != new DateTime(1, 1, 1)) addresses = addresses.Where(p => p.RecordDate <= endDate);

                var numberOfAddresses = addresses.Count();
                int numberOfPages = numberOfAddresses / 100;
                if (((numberOfAddresses % 100) > 0) || ((numberOfAddresses < 100) && (numberOfAddresses > 0))) numberOfPages++;

                return numberOfPages;
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Ошибка при попытке чтения из БД.");
                return 0;
            }
        }
        
    }
}