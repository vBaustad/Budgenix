using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRecurrenceFromExpenseAndIncome : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_Budgets_BudgetId",
                table: "Expenses");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_BudgetId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "RecurrenceFrequency",
                table: "Incomes");

            migrationBuilder.DropColumn(
                name: "BudgetId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "RecurrenceFrequency",
                table: "Expenses");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Budgets",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Budgets");

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceFrequency",
                table: "Incomes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "BudgetId",
                table: "Expenses",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceFrequency",
                table: "Expenses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_BudgetId",
                table: "Expenses",
                column: "BudgetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_Budgets_BudgetId",
                table: "Expenses",
                column: "BudgetId",
                principalTable: "Budgets",
                principalColumn: "Id");
        }
    }
}
