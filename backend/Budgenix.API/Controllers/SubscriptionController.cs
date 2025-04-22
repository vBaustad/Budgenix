using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    public class SubscriptionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
