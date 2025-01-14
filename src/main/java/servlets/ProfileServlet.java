package servlets;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/profile")
public class ProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        String userIDs = request.getParameter("user_id");
        if (userIDs == null || userIDs.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", "user_id is required");
            response.getWriter().write(gson.toJson(errorResponse));
            return;
        }
        try(Connection c = DBConnection.getConnection()){
            int userId = Integer.parseInt(userIDs);
            User user = IDgetuser(userId, c);
            if (user != null) {
                ArrayList<searchE> searchHistory = getSearchHistory(userId, c);
                JsonObject jr = new JsonObject();
                jr.addProperty("username", user.getUsername());
                jr.add("searchHistory", gson.toJsonTree(searchHistory)); 
                response.setContentType("application/json");
                response.getWriter().write(gson.toJson(jr));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonObject errorResponse = new JsonObject();
                errorResponse.addProperty("error", "User not found");
                response.getWriter().write(gson.toJson(errorResponse));
            }
        } catch (SQLException | NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", "An error occurred while processing your request.");
            response.getWriter().write(gson.toJson(errorResponse));
            e.printStackTrace();
        }
    }

    public User IDgetuser(int userId, Connection conn) throws SQLException {
        String qu = "SELECT username, password FROM users WHERE user_id = ?";
        PreparedStatement ps = conn.prepareStatement(qu);
        ps.setInt(1, userId);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            String username = rs.getString("username");
            String password = rs.getString("password");
            return new User(userId, username, password);
        } else {
            return null;
        }
    }

    public ArrayList<searchE> getSearchHistory(int userId, Connection conn) throws SQLException {
        String qs = "SELECT search_query, timestamp FROM searches WHERE user_id = ? ORDER BY timestamp DESC";
        PreparedStatement pss = conn.prepareStatement(qs);
        pss.setInt(1, userId);
        ResultSet rsSearches = pss.executeQuery();
        ArrayList<searchE> searchHistory = new ArrayList<>();
        while (rsSearches.next()) {
            String searchTerm = rsSearches.getString("search_query");
            String timestamp = rsSearches.getTimestamp("timestamp").toString();
            String type = isLatLon(searchTerm) ? "LatLon" : "City";
            searchHistory.add(new searchE(searchTerm, type, timestamp));
        }
        return searchHistory;
    }

    public boolean isLatLon(String sq) {
        String[] p = sq.split(",");
        if (p.length == 2) {
            try {
                Double.parseDouble(p[0].trim());
                Double.parseDouble(p[1].trim());
                return true;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }
}

