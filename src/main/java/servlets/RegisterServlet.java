package servlets;

import java.io.IOException;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        response.setContentType("application/json"); 
        response.setCharacterEncoding("UTF-8");
        try(Connection c = DBConnection.getConnection()){
            String cq = "SELECT * FROM users WHERE username = ?";
            PreparedStatement ps = c.prepareStatement(cq);
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); 
                response.getWriter().write("{\"status\":\"error\", \"message\":\"Username already exists!\"}");
                return;
            }
            String iq = "INSERT INTO users (username, password) VALUES (?, ?)";
            PreparedStatement insertStmt = c.prepareStatement(iq);
            insertStmt.setString(1, username);
            insertStmt.setString(2, password);
            insertStmt.executeUpdate();
            response.getWriter().write("{\"status\":\"success\", \"message\":\"Registration successful!\"}");
        } 
        catch (SQLException e){
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); 
            response.getWriter().write("{\"status\":\"error\", \"message\":\"An error occurred.\"}");
        }
    }
}