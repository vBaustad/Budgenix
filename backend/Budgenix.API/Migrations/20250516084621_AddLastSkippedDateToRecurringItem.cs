using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLastSkippedDateToRecurringItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastSkippedDate",
                table: "RecurringItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastTriggeredDate",
                table: "RecurringItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RecurringItems_CategoryId",
                table: "RecurringItems",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecurringItems_Categories_CategoryId",
                table: "RecurringItems",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecurringItems_Categories_CategoryId",
                table: "RecurringItems");

            migrationBuilder.DropIndex(
                name: "IX_RecurringItems_CategoryId",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "LastSkippedDate",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "LastTriggeredDate",
                table: "RecurringItems");
        }
    }
}
