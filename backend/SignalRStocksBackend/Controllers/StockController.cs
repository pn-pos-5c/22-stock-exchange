using Microsoft.AspNetCore.Mvc;
using SignalRStocksBackend.DTOs;
using SignalRStocksBackend.Services;

namespace SignalRStocksBackend.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly StockTickerService stockTickerService;
    private readonly StockService stockService;

    public StockController(StockTickerService stockTickerService, StockService stockService)
    {
        this.stockTickerService = stockTickerService; //to force start the ticker
        this.stockService = stockService;
    }

    [HttpGet]
    public int TickSpeed()
    {
        Console.WriteLine($"StockController::TickSpeed GET");
        return stockTickerService.TickSpeed;
    }

    [HttpPut]
    public int TickSpeed(TickSpeedDto tickSpeedDto)
    {
        Console.WriteLine($"StockController::TickSpeed PUT {tickSpeedDto.Speed}");
        return stockTickerService.TickSpeed = tickSpeedDto.Speed;
    }

    [HttpGet]
    public string Testerl()
    {
        Console.WriteLine($"StockController::Testerl");
        return "Done";
    }

    [HttpGet]
    public IActionResult GetShares()
    {
        return Ok(stockService.GetAllShares());
    }

    [HttpGet]
    public IActionResult GetCash(string name)
    {
        return Ok(stockService.GetCash(name));
    }

    [HttpGet]
    public IActionResult GetDepots(string name)
    {
        return Ok(stockService.GetDepots(name));
    }
}
