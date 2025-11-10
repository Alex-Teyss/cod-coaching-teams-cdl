/**
 * Utilitaire centralisé pour gérer les liens des notifications
 * Permet de modifier facilement les redirections dans le futur
 */

export type NotificationType =
  | "INVITATION_RECEIVED"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "TEAM_VALIDATED"
  | "PLAYER_REMOVED"

interface NotificationLinkParams {
  type: NotificationType
  metadata?: {
    teamId?: string
    invitationId?: string
    playerId?: string
    [key: string]: unknown
  }
}

/**
 * Retourne le lien approprié pour un type de notification donné
 */
export function getNotificationLink(params: NotificationLinkParams): string {
  const { type, metadata } = params

  switch (type) {
    case "INVITATION_RECEIVED":
      return "/player/invitations"

    case "INVITATION_ACCEPTED":
      return "/coach/dashboard"

    case "INVITATION_DECLINED":
      return "/coach/invitations"

    case "TEAM_VALIDATED":
      return "/coach/dashboard"

    case "PLAYER_REMOVED":
      return "/player/dashboard"

    default:
      return "/"
  }
}
