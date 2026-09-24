namespace HousingMap.Domain.Gis;

/// <summary>
/// Candidate plot states from the spec. The authority has not yet approved a final list
/// (see 11-open-decisions.md), so the API must not expose status publicly until it does.
/// </summary>
public enum PlotStatus
{
    Unknown,
    Available,
    Allocated,
    Sold,
    Reserved,
    Blocked,
    UnderDispute,
}
