using AutoMapper;
using Budgenix.Data;
using Budgenix.Dtos.Categories;
using Budgenix.Models.Categories;
using Budgenix.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(BudgenixDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {

            var categories = await _context.Categories.ToListAsync();
            var categoriesDto = _mapper.Map<List<CategoryDto>>(categories);

            return Ok(categoriesDto);
        }
    }
}
