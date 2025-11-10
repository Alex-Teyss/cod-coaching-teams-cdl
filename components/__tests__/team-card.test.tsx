import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamCard } from "../team-card";

// Mock fetch
global.fetch = vi.fn();

// Mock useRouter
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

const mockTeam = {
  id: "team-1",
  name: "Team Alpha",
  image: null,
  isValidated: false,
  _count: {
    players: 2,
  },
  players: [
    {
      id: "player-1",
      name: "John Doe",
      email: "john@test.com",
      image: null,
    },
    {
      id: "player-2",
      name: "Jane Smith",
      email: "jane@test.com",
      image: null,
    },
  ],
  invitations: [],
};

describe("TeamCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render team name", () => {
    render(<TeamCard team={mockTeam} />);
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
  });

  it("should show player count", () => {
    render(<TeamCard team={mockTeam} />);
    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/4 joueurs/)).toBeInTheDocument();
  });

  it("should display all players", () => {
    render(<TeamCard team={mockTeam} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
  });

  it("should show validated badge when team is validated", () => {
    const validatedTeam = { ...mockTeam, isValidated: true };
    render(<TeamCard team={validatedTeam} />);
    expect(screen.getByText("✓ Validée")).toBeInTheDocument();
  });

  it("should not show validated badge when team is not validated", () => {
    render(<TeamCard team={mockTeam} />);
    expect(screen.queryByText("✓ Validée")).not.toBeInTheDocument();
  });

  it("should show pending invitations count", () => {
    const teamWithInvitations = {
      ...mockTeam,
      invitations: [{}, {}] as any,
    };
    render(<TeamCard team={teamWithInvitations} />);
    expect(screen.getByText(/invitations en attente/)).toBeInTheDocument();
    const invitationCounts = screen.getAllByText("2");
    expect(invitationCounts.length).toBeGreaterThan(0);
  });

  it("should have edit button", () => {
    render(<TeamCard team={mockTeam} />);
    const editButton = screen.getByTitle("Modifier l'équipe");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute("href", "/coach/teams/team-1/edit");
  });

  it("should have delete button", () => {
    render(<TeamCard team={mockTeam} />);
    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    expect(deleteButton).toBeInTheDocument();
  });

  it("should show delete confirmation dialog when delete button is clicked", () => {
    render(<TeamCard team={mockTeam} />);
    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Supprimer l'équipe")).toBeInTheDocument();
    expect(
      screen.getByText(/Êtes-vous sûr de vouloir supprimer l'équipe/)
    ).toBeInTheDocument();
  });

  it("should close dialog when cancel is clicked", () => {
    render(<TeamCard team={mockTeam} />);
    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Supprimer l'équipe")).toBeInTheDocument();

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    waitFor(() => {
      expect(
        screen.queryByText(/Êtes-vous sûr de vouloir supprimer l'équipe/)
      ).not.toBeInTheDocument();
    });
  });

  it("should call delete API when delete is confirmed", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<TeamCard team={mockTeam} />);

    // Open delete dialog
    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    fireEvent.click(deleteButton);

    // Confirm delete
    const confirmButton = screen.getByRole("button", { name: /Supprimer$/ });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/teams/team-1", {
        method: "DELETE",
      });
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("should show error message when delete fails", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur lors de la suppression" }),
    } as Response);

    render(<TeamCard team={mockTeam} />);

    // Open delete dialog
    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    fireEvent.click(deleteButton);

    // Confirm delete
    const confirmButton = screen.getByRole("button", { name: /Supprimer$/ });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors de la suppression")
      ).toBeInTheDocument();
    });
  });

  it("should show message when team has no players", () => {
    const emptyTeam = {
      ...mockTeam,
      players: [],
      _count: { players: 0 },
    };
    render(<TeamCard team={emptyTeam} />);
    expect(
      screen.getByText("Aucun joueur dans cette équipe")
    ).toBeInTheDocument();
  });

  it("should warn about removing players when deleting team with players", () => {
    render(<TeamCard team={mockTeam} />);

    const deleteButton = screen.getByTitle("Supprimer l'équipe");
    fireEvent.click(deleteButton);

    expect(
      screen.getByText(/Les 2 joueurs de cette équipe seront retirés/)
    ).toBeInTheDocument();
  });
});
