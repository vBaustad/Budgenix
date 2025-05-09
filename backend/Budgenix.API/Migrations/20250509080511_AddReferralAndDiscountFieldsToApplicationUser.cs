using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgenix.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReferralAndDiscountFieldsToApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "BillingCycle",
                table: "AspNetUsers",
                type: "INTEGER",
                maxLength: 20,
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 20,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BillingCycle",
                table: "AspNetUsers",
                type: "TEXT",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldMaxLength: 20);
        }
    }
}
