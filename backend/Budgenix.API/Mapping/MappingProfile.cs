using AutoMapper;
using Budgenix.Dtos.Incomes;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;
using Budgenix.Dtos.Budgets;
using Budgenix.Models.Categories;
using Budgenix.Dtos.Categories;
using Budgenix.Dtos.Recurring;
using Budgenix.Dtos.Goals;

namespace Budgenix.Mapping
{
    public class MappingProfile : Profile
    {
        

        public MappingProfile() 
        {


            //Income mappings
            CreateMap<Income, IncomeDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<CreateIncomeDto, Income>();
            CreateMap<UpdateIncomeDto, Income>();


            //Expense mappings
            CreateMap<Expense, ExpenseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<CreateExpenseDto, Expense>();
            CreateMap<UpdateExpenseDto, Expense>();

            //Budget mappings
            CreateMap<Budget, BudgetDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<CreateBudgetDto, Budget>();
            CreateMap<UpdateBudgetDto, Budget>();

            //Category mapping
            CreateMap<Category, CategoryDto>();

            //Recurring mapping
            CreateMap<RecurringItem, RecurringItemDto>()
                .ForMember(dest => dest.NextOccurrenceDate,
                    opt => opt.MapFrom<NextOccurrenceResolver>());

            //Goals mapping
            CreateMap<Goal, GoalDto>();
            CreateMap<CreateGoalDto, Goal>();
            CreateMap<UpdateGoalDto, Goal>();



        }
    }
}
