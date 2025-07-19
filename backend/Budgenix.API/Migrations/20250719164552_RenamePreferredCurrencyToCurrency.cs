using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class RenamePreferredCurrencyToCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreferredCurrency",
                table: "AspNetUsers",
                newName: "Currency");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Currency",
                table: "AspNetUsers",
                newName: "PreferredCurrency");
        }
    }
}
