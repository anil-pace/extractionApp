/*
    Generated using:
    cat components/scripts/server_messages.json | sed 's/^.*: /_(/g' | sed 's/,$//g' | grep Ev "({|})" | sed 's/$/);/g'
 */
function server_messages_list() {
  
  _("Username")
  _("Password")
  _("Language")
  _("Login to")
  _("Enter username")
  _("Enter password")
  _("LOGIN")
  _("Logout")
  _("Scan ID card to login.")

  _("Connection is closed. Connecting...")
  _("System is Idle")
  _("Invalid credentials")
  _("Login not allowed. You're already logged in")
  _("Slot scan successful")
  _("Cancel scan successful")
  _("Select Station Id")
  _("Wait for MTU")
  _("Select MTU point")
  _("MTU docked")
  _("Action overdue")
  _("MTU waiting for bot")
  _("Current MTU")
  _("All removed")
  _("Cancel")
  _("Cancel Scan")
  _("Confirm")
  _("Remove all Totes from the MTU")
  _("Put tote in MTU and scan slot")
  _("Scan empty tote")
  _("MTU clear successfully")
  _("Tote scan successful")
  _("Tote docked successfully")
  _("All Entities removed")
  _("Are you sure all Entities are removed from the MTU?")
  _("MTU will auto undock after Confirmation.")
  _("Error during WebSocket handshake")
}