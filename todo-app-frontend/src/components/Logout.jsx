// bootstrap components
import { Button } from "react-bootstrap"

const Logout = ({ handleLogout }) => {
    return (
        <Button variant="outline-secondary" size="sm" onClick={handleLogout}>logout</Button>
    )
}

export default Logout