using Microsoft.AspNetCore.Mvc;
using Budgenix.Models.Shared;
using Budgenix.Dtos;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : Controller
    {
        private readonly BudgenixDbContext _context;

        public BudgetController(BudgenixDbContext context)
        {
            _context = context;
        }

        //[HttpGet]
        //public async Task<ActionResult> GetBudgets(
        //    DateTime? from = null,
        //    DateTime? to = null,
        //    string? category = null,
        //    string sort = "date_desc",
        //    string? groupBy = null,
        //    int skip = 0,
        //    int take = 100)
        //{
        //    var budgets = _context.Budgets.AsQueryable();


        //    if (from.HasValue)
        //        budgets = budgets.Where(b => b.Da)

        //}

    }
}
