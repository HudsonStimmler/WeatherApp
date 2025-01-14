

package servlets;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        try(Connection c = DBConnection.getConnection()){
            String q = "SELECT user_id, password FROM users WHERE username = ?";
            PreparedStatement ps = c.prepareStatement(q);
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                String cp = rs.getString("password");
                int userId = rs.getInt("user_id");
                if(cp.equals(password)){
                    response.setContentType("application/json");
                    response.getWriter().write("{\"status\":\"success\", \"user_id\":" + userId + "}");
                }
                else{
                    response.setContentType("application/json");
                    response.getWriter().write("{\"status\":\"error\", \"message\":\"Incorrect password!\"}");
                }
            } 
            else{
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":\"error\", \"message\":\"Username not found!\"}");
            }
        } 
        catch (SQLException e){
            e.printStackTrace();
            response.getWriter().write("{\"status\":\"error\", \"message\":\"An error occurred: " + e.getMessage() + "\"}");
        }
    }
}