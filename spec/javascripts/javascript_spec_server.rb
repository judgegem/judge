require 'rack'
require 'net/http'

class JavascriptSpecServer < Struct.new(:port, :root)

  def boot
    thread = Thread.new do
      app = Rack::File.new(root)
      Rack::Server.start(:app => app, :Port => port, :AccessLog => [])
    end
    thread.join(0.1) until ready?
  end

  def ready?
    uri = URI("http://localhost:#{port}/spec/javascripts/index.html")
    response = Net::HTTP.get_response(uri)
    response.is_a? Net::HTTPSuccess
  rescue SystemCallError
    return false
  end
end
