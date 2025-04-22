using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    public class HouseholdController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
