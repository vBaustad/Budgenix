using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexesToImproveOverviewSpeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecurringItems_UserId",
                table: "RecurringItems");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_UserId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_UserId",
                table: "Expenses");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringItems_UserId_StartDate",
                table: "RecurringItems",
                columns: new[] { "UserId", "StartDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_UserId_Date",
                table: "Incomes",
                columns: new[] { "UserId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_UserId_Date",
                table: "Expenses",
                columns: new[] { "UserId", "Date" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecurringItems_UserId_StartDate",
                table: "RecurringItems");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_UserId_Date",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_UserId_Date",
                table: "Expenses");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringItems_UserId",
                table: "RecurringItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_UserId",
                table: "Incomes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_UserId",
                table: "Expenses",
                column: "UserId");
        }
    }
}
