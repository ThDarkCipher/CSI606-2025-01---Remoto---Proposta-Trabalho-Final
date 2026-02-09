using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GemaGestor.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardController : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataAquisicao",
                table: "Pedra",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Pedra",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAquisicao",
                table: "Lotes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Lotes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAquisicao",
                table: "Pedra");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Pedra");

            migrationBuilder.DropColumn(
                name: "DataAquisicao",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Lotes");
        }
    }
}
