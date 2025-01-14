package servlets;

import java.io.IOException;
import java.sql.*;

import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/search")
public class SearchServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String useID = request.getParameter("user_id");
        String sq = request.getParameter("search_query");
        if(useID == null || useID.trim().isEmpty() || sq == null || sq.trim().isEmpty()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonObject eresponse = new JsonObject();
            eresponse.addProperty("error", "user_id and search_query are required");
            response.getWriter().write(eresponse.toString());
            return;
        }
        try(Connection conn = DBConnection.getConnection()){
            int userId = Integer.parseInt(useID);
            User user = IDgetUser(userId, conn);
            if(user != null){
                String iq = "INSERT INTO searches (user_id, search_query, timestamp) VALUES (?, ?, NOW())";
                PreparedStatement ps = conn.prepareStatement(iq);
                ps.setInt(1, userId);
                ps.setString(2, sq);
                int rows = ps.executeUpdate();
                if(rows > 0){
                    JsonObject sr = new JsonObject();
                    sr.addProperty("status", "success");
                    response.getWriter().write(sr.toString());
                } 
                else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    JsonObject eresponse = new JsonObject();
                    eresponse.addProperty("error", "Failed to save search");
                    response.getWriter().write(eresponse.toString());
                }
            } 
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonObject eresponse = new JsonObject();
                eresponse.addProperty("error", "User does not exist");
                response.getWriter().write(eresponse.toString());
            }

        } 
        catch(SQLException | NumberFormatException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject eresponse = new JsonObject();
            eresponse.addProperty("error", "An error occurred.");
            response.getWriter().write(eresponse.toString());
            e.printStackTrace();
        }
    }

    public User IDgetUser(int userId, Connection conn) throws SQLException {
        String quser = "SELECT username, password FROM users WHERE user_id = ?";
        PreparedStatement psUser = conn.prepareStatement(quser);
        psUser.setInt(1, userId);
        ResultSet rsUser = psUser.executeQuery();
        if(rsUser.next()){
            String username = rsUser.getString("username");
            String password = rsUser.getString("password");
            return new User(userId, username, password);
        } 
        else{
            return null; 
        }
    }
}

