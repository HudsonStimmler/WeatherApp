package servlets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.net.*;

@WebServlet("/weather") 
public class Weather extends HttpServlet {
    public static final long serialVersionUID = 1L;
    public static final String api = "16729b0e0f761044cc9a69ca47202bc2"; 
    public static final String urlb = "https://api.openweathermap.org/data/2.5/find";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String city = request.getParameter("city");
        String lat = request.getParameter("lat");
        String lon = request.getParameter("lon");
        if((city == null || city.isEmpty()) && (lat == null || lon == null || lat.isEmpty() || lon.isEmpty())){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\":\"Invalid parameters. Please provide a city or latitude/longitude.\"}");
            return;
        }
        try {
            String apilink;
            if(city != null && !city.isEmpty()){
                apilink = urlb + "?q=" + URLEncoder.encode(city, "UTF-8") + "&appid=" + api + "&units=metric&cnt=50";
            } 
            else{
                apilink = urlb + "?lat=" + URLEncoder.encode(lat, "UTF-8") + "&lon=" + URLEncoder.encode(lon, "UTF-8") + "&appid=" + api + "&units=metric&cnt=50";
            }
            URI uri = new URI(apilink);
            URL url = uri.toURL();
            HttpURLConnection c = (HttpURLConnection) url.openConnection();
            c.setRequestMethod("GET");
            int apiResponseCode = c.getResponseCode();
            InputStream is;
            if(apiResponseCode == 200){
                is = c.getInputStream();
            } 
            else{
                is = c.getErrorStream();
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(is));
            StringBuilder jr = new StringBuilder();
            String l;
            while((l = in.readLine()) != null){
                jr.append(l);
            }
            in.close();
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().write(jr.toString());
        } 
        catch (Exception e){
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"An error occurred while fetching weather data: " + e.getMessage() + "\"}");
        }
    }
}

