using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRecurringItemFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFulfilledForCurrentPeriod",
                table: "RecurringItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMatchedDate",
                table: "RecurringItems",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastMatchedTransactionId",
                table: "RecurringItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMissedDate",
                table: "RecurringItems",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextExpectedDate",
                table: "RecurringItems",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFulfilledForCurrentPeriod",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "LastMatchedDate",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "LastMatchedTransactionId",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "LastMissedDate",
                table: "RecurringItems");

            migrationBuilder.DropColumn(
                name: "NextExpectedDate",
                table: "RecurringItems");
        }
    }
}
